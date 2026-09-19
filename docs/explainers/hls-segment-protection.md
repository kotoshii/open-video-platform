# Protecting HLS segments without a database lookup per request

How private and age-restricted videos are kept from being fetched by anyone who has the URL, without asking the
database on every segment.

Related: [US-Videos-01](../user-stories/videos/US-Videos-01-Watch-videos.md),
[US-Videos-05](../user-stories/videos/US-Videos-05-Upload-videos.md).

---

## Part 1 — What a video actually is once it is stored

When someone watches, the browser does not fetch one file. HLS chops the video into thousands of small pieces:

```text
master.m3u8          <- a text file listing the available qualities
240/index.m3u8       <- a text file listing that quality's pieces
240/segment0.ts      <- 4 seconds of actual video
240/segment1.ts      <- the next 4 seconds
...
```

A 10-minute video at 4 seconds per segment is about 150 segments. **Watching it means roughly 150 separate HTTP
requests.**

## Part 2 — Why the segments are unprotected

Nginx with `nginx-s3-gateway` acts as a plain file server. A URL arrives, it maps it to a path in the bucket, it
streams the bytes back. It knows nothing about users, videos, or who may see what.

That is fine for a public video. For a private one, or one restricted to viewers over 18, anyone holding the URL gets
the bytes, because nothing along that path is capable of saying no.

## Part 3 — The obvious fix, and why it is too expensive

Make Nginx ask the API "is this person allowed?" before serving each segment. Nginx can do this — the feature is called
`auth_request` — and the API would look the video and the viewer up in Postgres.

That is **150 extra API calls and 150 database queries for one person watching one video.** Ten viewers, 1,500
queries. Nobody wants to pay that, and this document exists because we are not going to.

## Part 4 — The reframe

The permission check already happens. When the video page loads, `watchVideoByIdOrThrow` looks the video up, checks
published, private and NSFW, and either hands it over or refuses. One database lookup, once.

So the question is not "how do we check permission 150 times cheaply". It is:

> How do we let Nginx **trust a decision that was already made**, without asking anyone?

## Part 5 — What a signed token is

Think of a festival. Security checks your ID once at the gate. After that you show a wristband. Staff inside verify it
by looking at it — they do not radio back to the gate. It is hard to fake, and it stops working when the festival ends.

A signed token is exactly this. When the API authorizes someone, it produces a short string that is:

* tied to **this specific video**,
* valid until **this specific time**,
* signed with a **secret** known only to the API and Nginx.

Conceptually:

```text
token = hash(secret + videoId + expiry)
```

The hash is one-way. With the secret you compute the token in microseconds. Without the secret you cannot forge it,
even knowing the video id and the expiry. Nginx holds the same secret, so it recomputes what the token *should* be and
compares. That is pure arithmetic — no network call, no database, nothing to wait for.

## Part 6 — The part that makes it genuinely cheap

The naive approach puts the token on each segment's URL. But then every playlist file would have to be rewritten to
include it, per viewer, which means generating playlists on the fly instead of serving the static ones ffmpeg produced.

What rescues it: **HLS playlists use relative URLs.**

Inside `master.m3u8` the line is `240/index.m3u8`, not a full URL. Inside `240/index.m3u8` the line is `segment0.ts`.

Relative URLs resolve against the folder the current file came from. So if the browser fetched the master playlist from

```text
/hls/1789999999/ABC123/video-42/master.m3u8
```

then `240/index.m3u8` automatically becomes

```text
/hls/1789999999/ABC123/video-42/240/index.m3u8
```

and `segment0.ts` inside that becomes

```text
/hls/1789999999/ABC123/video-42/240/segment0.ts
```

**Put the token in the path prefix and every segment carries it for free.** The playlist files are never touched. They
stay exactly as ffmpeg wrote them, sitting in MinIO.

## Part 7 — Step by step

1. User opens the video page. The API checks permission — the one database lookup that already happens today.
2. Allowed. The API computes `expiry = now + 4 hours` and `token = hash(secret + videoId + expiry)`, and returns the
   playlist URL `/hls/1789999999/ABC123/video-42/master.m3u8`.
3. The player requests that URL.
4. Nginx pulls `video-42` and `1789999999` out of the path, recomputes the hash with its own copy of the secret, and
   compares it to `ABC123`. It also checks that the expiry has not passed. Either check fails → **403**.
5. Both pass → Nginx strips the expiry and the token from the path and fetches
   `video-bucket/video-42/hls/master.m3u8` from MinIO.
6. The player reads the playlist and requests `240/index.m3u8`. Relative, so the same prefix, so the token comes along.
   Nginx validates again — more arithmetic.
7. The same for all 150 segments.

**150 hash comparisons. Zero database queries.**

## Part 8 — What to build

The Nginx piece is `ngx_http_secure_link_module`, built into standard Nginx — nothing to compile. A regex location
pulls the pieces out of the path and hands them to the module:

```nginx
location ~ ^/hls/(?<expires>\d+)/(?<token>[^/]+)/(?<video_id>[^/]+)/(?<rest>.*)$ {
    secure_link      $token,$expires;
    secure_link_md5  "$video_id$expires SECRET";

    if ($secure_link = "")  { return 403; }   # token does not match
    if ($secure_link = "0") { return 410; }   # token valid but expired

    proxy_pass http://minio_gateway/video-bucket/$video_id/hls/$rest;
}
```

`$secure_link` comes out as `""` when the token does not match, `"0"` when it matched but the time has passed, and
`"1"` when it is good.

### Getting the secret into the config

Nginx configuration files cannot read environment variables — there is no syntax for it. The official nginx image
solves this at start-up: it runs `envsubst` over every `*.template` file in `/etc/nginx/templates/` and writes the
result into `/etc/nginx/conf.d/`. That is exactly why the gateway config in this repository lives under
`docker/nginx/templates/`.

So the secret is written as a placeholder in the template:

```nginx
secure_link_md5 "$video_id$expires ${HLS_SECURE_LINK_SECRET}";
```

and supplied as an environment variable on the container. The same value goes to video-api, which is the other half of
the pair ([infrastructure.md](../specs/infrastructure.md)).

One detail that confuses people the first time: the image's script only substitutes variables that actually exist in
the environment, so nginx's own `$video_id` and `$expires` are left untouched. Running plain `envsubst` by hand without
that restriction blanks every nginx variable in the file.

### Computing the same token in the API

Both sides must produce **byte-identical input** to MD5, and nginx's format is specific: MD5 of the string, then
standard base64, then made URL-safe by replacing `+` with `-` and `/` with `_`, and stripping the `=` padding.

```ts
import crypto from "node:crypto";

const expires = Math.floor(Date.now() / 1000) + 4 * 60 * 60;

// must match secure_link_md5 exactly — including the space before the secret
const payload = `${videoId}${expires} ${process.env.HLS_SECURE_LINK_SECRET}`;

const token = crypto
	.createHash("md5")
	.update(payload)
	.digest("base64")
	.replaceAll("+", "-")
	.replaceAll("/", "_")
	.replaceAll("=", "");

const playlistUrl = `/hls/${expires}/${token}/${videoId}/master.m3u8`;
```

**That space before the secret is part of the hashed string.** It is in the nginx directive above, so it must be in the
payload here too. A mismatch of one character produces a completely different hash, and every request returns 403 with
nothing explaining why — this is the single most likely thing to go wrong in the whole mechanism.

`expires` is a Unix timestamp in **seconds**, not milliseconds. Sending milliseconds makes every link valid for
approximately fifty thousand years, which is a quiet failure rather than a loud one.

### Checking it works

```bash
# the real URL the API returned — expect 200
curl -sI "http://localhost/hls/1789999999/ABC123/video-42/master.m3u8" | head -1

# same URL with one character of the token changed — expect 403
curl -sI "http://localhost/hls/1789999999/XBC123/video-42/master.m3u8" | head -1

# valid token, expiry in the past — expect 410
curl -sI "http://localhost/hls/1000000000/<token-for-that-expiry>/video-42/master.m3u8" | head -1
```

If the first line returns 403, the two payload strings disagree. Log both sides once while debugging, compare them
character by character, then remove the logging — the string contains the secret.

Two notes on the hash: the built-in module uses MD5 over a string containing the secret. What matters here is that the
token cannot be forged without the secret, not collision resistance, so this is adequate. If SHA-256 is wanted instead,
it needs njs or Lua rather than the built-in module.

The module can also bind the token to `$remote_addr`, tying it to one IP. That sounds attractive and usually is not
worth it: a phone moving between wifi and mobile data changes IP mid-video and playback dies.

## Part 9 — What this protects against, and what it does not

| Someone…                                             | Result                                                      |
|------------------------------------------------------|-------------------------------------------------------------|
| Guesses or scrapes a segment URL                     | **Blocked** — the token cannot be forged without the secret |
| Was never allowed to watch                           | **Blocked** — they never received a token                   |
| Saves a link and comes back next week                | **Blocked** — expired                                       |
| Was allowed, and sends the URL to a friend right now | **Works, until the token expires**                          |

The last row is the honest trade-off. It is the same property as CloudFront or YouTube signed URLs — the standard
answer, not a compromise unique to this project. It turns "leaked forever" into "leaked for a few hours".

## Part 10 — Two things to get right

**Tokenize every video, public ones included.** A plain route cannot tell a public video from a private one, so any
video reachable without a token is reachable by anyone who guesses its id. Caching does not suffer: leave the token out
of `proxy_cache_key`, and every viewer shares one cached copy, while the token is still checked before the cache is
consulted.

**Make the expiry generous** — the video's length plus slack, or simply a few hours. If it lapses mid-playback the
segments start returning 403 and it looks like a broken player, not like a security feature.

And if tokenized responses are cached in Nginx at all, strip the token from `proxy_cache_key`, or Nginx stores a
separate copy of every segment for every viewer.
