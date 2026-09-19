# FFmpeg parameters for video processing

Everything `video-processing-worker` runs, in the order it runs it, with the reasoning behind each parameter. Written to
be built from directly.

The surrounding pipeline — the BullMQ tasks, the events, the S3 layout — is specified in
[US-Videos-05](../specs/user-stories/videos/US-Videos-05-Upload-videos.md). This document is the encoding half.

---

## Part 1 — The job graph

One upload becomes a tree of jobs. Nothing here is sequential except where it has to be.

```
VideoUploadCompleted
        │
        ▼
   [probe job]  ──── ffprobe: dimensions, duration, fps, audio present?
        │             decide which rungs to encode; store duration + dimensions
        │
        ├──────────────► [thumbnails job] ──► VideoThumbnailsGenerated
        │
        ├──────────────► [sprite job]     ──► (no event; needed before previews work)
        │
        ├──► [encode 240p] ──► [package 240p HLS] ──► rewrite master.m3u8 ──► VideoQualityReady(240)
        ├──► [encode 360p] ──► [package 360p HLS] ──► rewrite master.m3u8 ──► VideoQualityReady(360)
        └──► [encode 720p] ──► [package 720p HLS] ──► rewrite master.m3u8 ──► VideoQualityReady(720)
                                                                      │
                                    when every rung and the thumbnails are done
                                                                      ▼
                                                          VideoProcessingCompleted
```

Two properties of this shape matter:

* **Rungs are independent and finish out of order.** 720p can beat 360p. The worker tracks per-video, per-rung state
  and never assumes a sequence — this is the trap already recorded in
  [open-decisions.md](../open-decisions.md).
* **A quality counts as ready when its HLS exists**, not when its MP4 does. The MP4 alone cannot be played by the
  player, so `VideoQualityReady` belongs after the packaging step.

**Failure of one rung is not failure of the video.** Retry the rung; if it keeps failing, mark that rung failed and
leave the others alone — a video with 3 of 4 qualities is fine. The exception is the *lowest* rung, because publishing
is gated on it: if that one cannot be produced, the video cannot be published and the author has to be told.

## Part 2 — Probe first

```bash
ffprobe -v error -print_format json -show_format -show_streams original.mkv
```

Four things come out of it, each deciding something:

| From probe                      | Decides                                                      |
|---------------------------------|--------------------------------------------------------------|
| `width`, `height`               | which rungs to encode, and whether the video is portrait      |
| `duration`                      | thumbnail timestamps, sprite interval, the stored duration    |
| presence of an audio stream     | whether the audio mapping can be unconditional (it cannot)    |
| `r_frame_rate`                  | the fallback keyframe settings in Part 6                      |

Read dimensions from the **video** stream (`codec_type == "video"`), not from the first stream in the list — plenty of
files put a cover image or a data stream first.

## Part 3 — The ladder, and which rungs to run

| Rung  | Short side | CRF | Max rate | Buffer  | Audio |
|-------|------------|-----|----------|---------|-------|
| 240p  | 240        | 23  | 600k     | 1200k   | 64k   |
| 360p  | 360        | 23  | 1200k    | 2400k   | 96k   |
| 480p  | 480        | 23  | 2100k    | 4200k   | 128k  |
| 720p  | 720        | 23  | 4200k    | 8400k   | 128k  |
| 1080p | 1080       | 23  | 7500k    | 15000k  | 192k  |

**The rung is the short side of the frame**, so a 1920×1080 landscape video and a 1080×1920 portrait one are both
"1080p". Selecting rungs by height would give portrait video a ladder of nearly square postage stamps.

Selection rule:

```
shortSide = min(width, height)
rungs = ladder.filter(r => r.shortSide <= shortSide)
if (rungs.isEmpty()) rungs = [ sourceRung(shortSide) ]   // source is below 240p
```

* **Never encode above the source.** Upscaling burns CPU and storage to produce a blurrier file than the input.
* **A source below 240p gets exactly one rung, at its own resolution** — copy the 240p bitrate settings for it, since
  the ceiling only matters when the encoder wants to exceed it. This keeps "publish once the lowest quality is ready"
  working for a 180p clip instead of leaving it unpublishable forever.

## Part 4 — Codecs

**H.264 (`libx264`) High profile, AAC-LC stereo.** Not fashionable, and correct: it plays in every browser, decodes in
hardware on every phone, and `hls.js` handles it with no special cases.

AV1 and HEVC both produce smaller files. AV1 costs roughly an order of magnitude more CPU per video; HEVC has no usable
browser story outside Safari. Either would mean maintaining a second ladder as a fallback, and when the point of the
project is the architecture rather than codec research, one ladder that always plays is worth more than 30% smaller
files.

## Part 5 — Encoding one rung

```bash
ffmpeg -i original.mkv \
  -map 0:v:0 -map 0:a:0? \
  -vf "scale='if(gt(iw,ih),-2,360)':'if(gt(iw,ih),360,-2)'" \
  -c:v libx264 -profile:v high -preset medium \
  -crf 23 -maxrate 1200k -bufsize 2400k \
  -force_key_frames "expr:gte(t,n_forced*4)" \
  -c:a aac -b:a 96k -ac 2 \
  -movflags +faststart \
  master/master_360.mp4
```

Substitute the rung's short side into the scale filter, and its bitrates into `-maxrate`, `-bufsize` and `-b:a`.
Everything else is identical across rungs — deliberately, because Part 6 depends on it.

**`-map 0:v:0 -map 0:a:0?`** — take the first video stream and the first audio stream *if one exists*. The `?` is what
makes it optional. Without it, every silent video fails, and silent video is common: screen recordings, muted phone
clips, exports from editing tools. This is the most likely way a first pipeline breaks on real input.

**The scale expression** reads as: if the source is wider than it is tall, set height to the rung and let width follow;
otherwise set width to the rung and let height follow. `-2` means "whatever preserves the aspect ratio, rounded to an
even number" — H.264 requires even dimensions, and a hardcoded `-1` will eventually produce an odd number and fail.

**`-crf 23` with `-maxrate` and `-bufsize`** is capped CRF: aim at a quality target, but never exceed a ceiling. Plain
CRF gives consistent quality with wildly varying bitrate, which ruins the player's switching decisions. Plain CBR
wastes bits on still scenes. Capped CRF is the standard VOD answer and needs only one pass. `bufsize` is conventionally
twice `maxrate`: it is the window over which the ceiling is enforced, so a larger buffer allows longer bursts.

**`-preset medium`** is the speed/size dial — `slow` is roughly 10% smaller for about double the CPU, `fast` the
reverse. Revisit once real job durations exist.

**`-movflags +faststart`** relocates the moov atom to the front of the file so a download starts playing before it
finishes transferring. It costs one extra pass over the finished file.

## Part 6 — The parameter everything depends on

`-force_key_frames "expr:gte(t,n_forced*4)"` places a keyframe exactly every 4 seconds. This is the one setting that
cannot be wrong, and the reasoning is worth following from the beginning.

### Why a segment must start at a keyframe

Video is not stored as a sequence of complete pictures. A **keyframe** (an I-frame) is a complete picture, decodable on
its own. The frames after it are stored as *differences* — "the same as before, but this region moved" — and cannot be
decoded without the frames they refer back to. A keyframe plus the dependent frames that follow it is called a GOP,
a group of pictures.

The consequence: a decoder can only start at a keyframe. Hand it a file starting mid-GOP and it has nothing to apply
those differences to.

An HLS segment is a chunk the player fetches and decodes on its own, so **every segment must begin with a keyframe**.
That is not a convention, it is the only thing that can work.

### Why the renditions must agree

Adaptive playback means the player can change quality as it goes — it fetched two 360p segments, sees a fast
connection, and wants 720p next. It does that by fetching the next segment from a different rendition's playlist and
appending it to the same buffer.

That only works if segment 3 of 720p starts exactly where segment 2 of 360p ended. Which means the two ladders must be
cut at **the same timestamps**.

Now suppose the encoder chose keyframe positions by itself in each rendition. With default settings it emits one at
scene changes plus one every `-g` frames, and the counter restarts at each scene change — so two encodes of the same
source, with different bitrates and rate-control decisions, drift apart:

```
360p keyframes:  0.0   3.8   7.9   11.6   15.5 ...
720p keyframes:  0.0   4.2   8.1   12.4   16.0 ...
```

ffmpeg can only cut at a keyframe, so the segments inherit those positions and no longer line up. The failures that
follow are the confusing kind: audio and video drift apart after a quality change, playback stutters at every switch,
or the player refuses to switch at all and sits on one rendition forever. Nothing reports an error, and each rendition
looks perfect when played on its own.

Forcing keyframes at fixed times removes the encoder's discretion, so all renditions are cut identically and
**segment *n* covers the same four seconds in every rendition**.

### Reading the expression

```
-force_key_frames "expr:gte(t,n_forced*4)"
```

ffmpeg evaluates the expression for each frame. `t` is that frame's timestamp in seconds, and `n_forced` is how many
keyframes have been forced so far. When the expression is true, that frame becomes a keyframe.

Follow it through: at the start `n_forced` is 0, so the test is `t >= 0` — true for the first frame, which becomes a
keyframe and makes `n_forced` 1. The test is now `t >= 4`, which stays false until four seconds in, where the next
keyframe is forced and `n_forced` becomes 2. And so on: keyframes at 0, 4, 8, 12 seconds.

Every rung uses this identical expression. That is the whole mechanism.

### The older way, and why not to rely on it

```
-g <fps×4> -keyint_min <fps×4> -sc_threshold 0
```

`-g` sets the maximum GOP length in **frames**, `-keyint_min` the minimum, and `-sc_threshold 0` disables extra
keyframes at scene changes. At 30 fps, `-g 120` means a keyframe every 120 frames, which is every 4 seconds — as long
as the frame rate really is 30.

That is the catch. Phone recordings are frequently variable frame rate: nominally 30 fps, actually anywhere between 24
and 30 depending on light. Then 120 frames is not 4 seconds, it drifts, and it drifts differently per rendition.

The `force_key_frames` expression is expressed in **seconds**, so variable frame rate cannot break it. Setting both
does no harm and costs nothing.

### Segment length

**4 seconds**, and this is the dial worth understanding rather than copying. Shorter segments mean playback starts
sooner and the player reacts to bandwidth changes faster, at the cost of more HTTP requests per minute of video.
Apple's guidance is 6 seconds; live streaming often uses 2. Four is a reasonable middle for video on demand, and
segments are cached at the gateway anyway ([US-Videos-01](../specs/user-stories/videos/US-Videos-01-Watch-videos.md)).

Whatever the number, it appears in three places and they must agree: the `4` in this expression, the `-hls_time` in
Part 7, and the interval you expect to see when verifying in Part 11.

## Part 7 — Packaging one rung as HLS

```bash
ffmpeg -i master/master_360.mp4 \
  -c copy \
  -f hls \
  -hls_time 4 \
  -hls_playlist_type vod \
  -hls_list_size 0 \
  -hls_segment_type mpegts \
  -hls_segment_filename "hls/360/segment%d.ts" \
  hls/360/index.m3u8
```

**`-c copy` is the point of this whole design.** The MP4 already contains correctly encoded video with keyframes on a
4-second grid, so producing HLS means cutting it into pieces — a remux, not an encode. It takes seconds and loses no
quality, because no pixel is decoded and re-encoded.

That is why the pipeline encodes each rung once and packages it separately, rather than encoding the ladder twice.
Encoding is the expensive half; packaging is nearly free.

`-hls_time 4` must match the keyframe interval. ffmpeg can only cut at keyframes, so if these disagree it silently cuts
at the next one available and segment lengths drift — destroying the alignment Part 6 exists to create.

`-hls_playlist_type vod` marks the playlist complete and seekable; `-hls_list_size 0` keeps every segment in it rather
than a rolling window.

## Part 8 — The master playlist

### What it is

`hls/master.m3u8` is the file the player loads first, and for a moment it is the *only* thing the player knows about
the video. It does not contain video. It is a list of the available renditions, each described well enough for the
player to choose between them before downloading a single segment:

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=664000,RESOLUTION=426x240,CODECS="avc1.64000d,mp4a.40.2"
240/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1296000,RESOLUTION=640x360,CODECS="avc1.64001e,mp4a.40.2"
360/index.m3u8
```

Each `#EXT-X-STREAM-INF` line describes the rendition whose playlist is named on the line below it.

The worker writes this file, not ffmpeg. ffmpeg can produce a master playlist itself, but only when every rendition is
packaged in a single command — and this pipeline deliberately encodes rungs as independent jobs that finish in any
order. So the worker rewrites the master after each rung is packaged, listing the rungs that exist so far, ordered by
bandwidth ascending. A player loading it mid-processing sees a valid playlist with fewer choices, which is exactly what
[US-Videos-05](../specs/user-stories/videos/US-Videos-05-Upload-videos.md) means by a video being publishable before every
quality exists.

### BANDWIDTH

The **peak** bitrate of the rendition, not the average: the rung's `maxrate` plus its audio bitrate. The player uses it
to guess what the connection can sustain. Understate it and the player picks a rendition too heavy for the connection,
then rebuffers.

### RESOLUTION

The real output size, from probing the file that was produced — not the rung label. The player shows it in the quality
picker and uses it to avoid choosing a rendition far larger than the display.

### CODECS — what it means and why it must be probed

This is the attribute that breaks playback in confusing ways, so it is worth understanding rather than copying.

`CODECS` declares which codecs the segments actually use, in the format defined by RFC 6381. Before downloading
anything, the player asks the browser whether it can decode that exact string, through
`MediaSource.isTypeSupported('video/mp4; codecs="avc1.64001e,mp4a.40.2"')`. **If the browser answers no, `hls.js`
removes that rendition from the ladder** — it never requests a segment to find out. The string is a promise the player
believes without checking.

The string encodes three things about the H.264 stream:

```
avc1.PPCCLL
     │ │ └── level          two hex digits
     │ └──── constraint flags   two hex digits
     └────── profile        two hex digits
```

* **Profile** is the feature set the encoder used. `-profile:v high` means every rendition here is High, which is
  `100` in decimal, `64` in hex. (Main is `77` → `4d`, Baseline `66` → `42`.)
* **Constraint flags** are `00` for ordinary encodes. Constrained Baseline is the exception, written `42e0…`.
* **Level** is a limit on resolution, frame rate and bitrate combined — roughly "how demanding this stream is to
  decode". **The encoder chooses it automatically from what it was asked to produce**, so it differs per rung.

That last point is the whole reason for probing. Encoding the same source into a 240p and a 1080p rendition with
identical flags produces two files with *different levels*: something like level 1.3 for the small one and 4.0 for the
large one. Level is the only part of the string that varies, and it varies exactly per rendition.

`ffprobe` reports both fields:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=profile,level -of csv=p=0 master/master_360.mp4
```

It prints the profile as a name and the level as an integer with the decimal point removed — `30` for level 3.0, `31`
for 3.1, `40` for 4.0. Convert that integer to two hex digits:

| Level | ffprobe | hex | Full string for High profile |
|-------|---------|-----|-------------------------------|
| 1.3   | 13      | 0d  | `avc1.64000d`                 |
| 3.0   | 30      | 1e  | `avc1.64001e`                 |
| 3.1   | 31      | 1f  | `avc1.64001f`                 |
| 4.0   | 40      | 28  | `avc1.640028`                 |
| 4.1   | 41      | 29  | `avc1.640029`                 |

So the whole construction is: `"avc1." + profileHex + "00" + levelHex`, where `levelHex = level.toString(16).padStart(2, "0")`.

The audio half is constant: **AAC-LC is always `mp4a.40.2`**, and it is omitted entirely from the string for a
rendition with no audio track.

**What goes wrong if it is hardcoded.** Suppose every rung is labelled `avc1.640028` (High, level 4.0) because that is
what the 1080p file happened to be. The 240p rendition then claims to be far more demanding to decode than it is. On a
device that supports only up to level 3.1, the browser answers "no" for every rendition — including the small one that
would have played perfectly — and the player reports no playable source. The low rung exists precisely for weak
devices, and a hardcoded string is how it gets thrown away on exactly those devices.

Getting the string malformed rather than merely wrong is worse: some players discard every rendition and fail with an
error that says nothing about codec strings.

## Part 9 — Thumbnails

Three suggestions, taken at 25%, 50% and 75% of the duration — the opening seconds of a video are usually black, a
title card, or a logo.

```bash
ffmpeg -ss 00:01:23 -i original.mkv -frames:v 1 -vf "scale=1280:-2" -q:v 3 thumbnails/thumbnail1.jpg
```

**`-ss` goes before `-i`.** There it seeks by jumping to the nearest keyframe; after `-i` it decodes the whole file up
to that timestamp. On a long video that is the difference between a second and several minutes. The cost is landing on
a keyframe rather than the exact frame, which is irrelevant for a thumbnail.

`-q:v` is the JPEG quality scale where 2 is best and 31 worst; 2–5 is the usable range.

These go to the private `thumbnails/` prefix. The one the author selects is copied to the public `thumbnail.jpg`
server-side inside MinIO ([US-Videos-05](../specs/user-stories/videos/US-Videos-05-Upload-videos.md)).

## Part 10 — Seek previews

### What is being built

Hovering the scrubber shows a small image of that moment in the video. Producing one image per preview would mean
hundreds of files and hundreds of HTTP requests, so instead every preview frame is packed into a few large images —
**sprite sheets** — and a **WEBVTT file** tells the player which rectangle of which sheet belongs to which moment.

The player therefore needs two things: the sheets, and the VTT that indexes them. ffmpeg produces the first. The worker
must write the second, because ffmpeg has no idea what a WEBVTT thumbnail track is.

### Pass one — extract the frames

```bash
ffmpeg -i original.mkv -vf "fps=1/10,scale=160:-2" -q:v 4 previews/frame%04d.jpg
```

`fps=1/10` means one frame every ten seconds — the filter resamples the video to that rate, so a 12-minute video yields
72 images. `scale=160:-2` makes each 160 pixels wide with the height following the aspect ratio, rounded to an even
number.

Ten seconds is right for ordinary videos, but a three-hour upload would produce over a thousand frames. Scale the
interval with the duration:

```
interval = max(10, ceil(durationSeconds / 150))
```

which holds the count near 150 however long the video is.

### Pass two — tile the frames into sheets

```bash
ffmpeg -start_number 0 -i previews/frame%04d.jpg -vf "tile=5x5" -q:v 4 previews/sprite%d.jpg
```

`tile=5x5` packs 25 frames into each output image, in reading order — left to right, then top to bottom. So 72 frames
become 3 sheets: two full ones and a last holding 22.

**`-start_number 0` matters.** ffmpeg's image output numbers files from 1 by default, so without it the first sheet is
`sprite1.jpg` and every index in the maths below is off by one. Forcing it to 0 makes sheet index and file number the
same thing.

Two passes rather than one because the VTT must describe **exactly** what was produced. Counting the extracted frames
on disk is the only reliable input for that; computing the count from the duration disagrees with reality at the end of
the file, and a VTT referencing a frame that does not exist shows a broken image while scrubbing.

### The coordinate maths

Take frame `i`, counting from zero, with a 5×5 grid, thumbnail width `w` = 160 and height `h` taken by probing one of
the extracted frames:

```
sheet = floor(i / 25)        which sprite file it landed in
pos   = i % 25               its position within that sheet, 0..24
x     = (pos % 5) * w        column, converted to pixels
y     = floor(pos / 5) * h   row, converted to pixels
start = i * interval         the moment this frame represents
end   = min((i + 1) * interval, duration)
```

`pos % 5` is the column because the grid is filled left to right; `floor(pos / 5)` is the row for the same reason.

**Worked example.** A 12-minute (720-second) 1920×1080 video, interval 10, so 72 frames. The thumbnail width is 160, so
`h` = 160 × 1080 ÷ 1920 = **90**. Take frame 27:

```
sheet = floor(27 / 25) = 1          → sprite1.jpg
pos   = 27 % 25        = 2          → third slot in that sheet
x     = (2 % 5) * 160  = 320        → third column
y     = floor(2/5) * 90 = 0         → first row
start = 27 * 10 = 270s              → 00:04:30.000
end   = 28 * 10 = 280s              → 00:04:40.000
```

### The VTT file

```
WEBVTT

00:00:00.000 --> 00:00:10.000
sprite0.jpg#xywh=0,0,160,90

00:00:10.000 --> 00:00:20.000
sprite0.jpg#xywh=160,0,160,90
```

Each cue is a time range followed by an image reference. The `#xywh=` fragment is the part doing the real work: it
names a rectangle inside the sheet as x, y, width, height. So the second cue means "for seconds 10 to 20, show the
160×90 rectangle of `sprite0.jpg` starting 160 pixels from the left".

Frame 27 from the worked example becomes:

```
00:04:30.000 --> 00:04:40.000
sprite1.jpg#xywh=320,0,160,90
```

Timestamps are `HH:MM:SS.mmm` and the milliseconds are not optional. Paths are relative to the VTT file's own location.

This is the format Plyr expects for its preview thumbnails, so wiring it up on the player side is a matter of pointing
it at this file ([US-Videos-01](../specs/user-stories/videos/US-Videos-01-Watch-videos.md)).

### Two things to check

**The final partial sheet exists.** 72 frames into a 5×5 grid leaves the last sheet 22 of 25 full. Recent ffmpeg
flushes that partial tile at end of input, but confirm the file is there — if it is missing, previews silently vanish
over the last minutes of every video, which is easy not to notice while testing on the beginning.

**The geometry lives in one place.** The grid size, the thumbnail width, the interval and the VTT writer are four
expressions of the same numbers. Keep them in one module. When they drift — a 6×5 grid with a VTT still dividing by 5 —
the previews show the wrong frames, and every one of them is wrong by a different amount.

## Part 11 — Verifying it actually worked

Do not trust the ladder because the jobs exited zero. Three checks catch essentially everything:

**Keyframes land on the grid**, and identically in every rendition:

```bash
ffprobe -v error -select_streams v:0 -skip_frame nokey \
  -show_entries frame=pts_time -of csv=p=0 master/master_360.mp4
```

Expect `0, 4, 8, 12, …` — and the same list for every rung. If the numbers drift or differ between rungs, quality
switching is broken no matter how good each rendition looks alone. On older ffmpeg the field is `pkt_pts_time`.

**Segments are the length they claim:**

```bash
grep EXTINF hls/360/index.m3u8
```

Every value should be 4.0 except the last. Values like 3.4 and 5.1 mean ffmpeg was cutting at keyframes that were not
where Part 6 intended.

**The master playlist is honest** — check `RESOLUTION` and `CODECS` against `ffprobe` of each rendition. A wrong
`CODECS` string fails in the most confusing possible way: the player loads the master playlist, silently discards the
renditions it believes it cannot decode, and either plays one quality forever or reports that no playable source
exists.

## Part 12 — Traps

* **Rotation metadata.** Phone video is often recorded sideways with a display matrix telling players to rotate it.
  Current ffmpeg applies it automatically; older versions did not. Test with a real portrait phone clip rather than
  trusting either behaviour — getting it wrong produces an entire ladder of sideways files.
* **FFmpeg saturates every core it is given.** Set BullMQ concurrency to one or two per worker instance. Without a
  limit, several encodes on one machine make all of them slow and starve the API processes sharing it — see
  [scaling-to-multiple-instances.md](scaling-to-multiple-instances.md).
* **Job timeouts must be generous.** A 10 GB 1080p source is minutes of CPU per rung, not seconds. A default timeout
  will kill jobs that were working perfectly.
* **`-progress pipe:1`** writes machine-readable progress (frame, out_time_ms, speed) that can drive the status updates
  the uploading page already shows, instead of parsing ffmpeg's human-readable stderr, which is not a stable format.
* **Work in a temp directory and upload on success.** A job killed halfway otherwise leaves partial files in the bucket
  under names the rest of the system treats as finished.

## Part 13 — What to store per rendition

Probe the file that was produced rather than trusting the parameters that were requested — what the encoder actually
emitted is what the player and the download dialog have to agree with:

| Value                  | Used by                                                                                  |
|------------------------|-------------------------------------------------------------------------------------------|
| byte size              | the download dialog ([US-Videos-02](../specs/user-stories/videos/US-Videos-02-Download-videos.md)) |
| width, height          | `RESOLUTION` in the master playlist                                                       |
| actual bitrate         | `BANDWIDTH` in the master playlist                                                        |
| profile and level      | `CODECS` in the master playlist                                                           |
| rung label (240p …)    | the quality picker and the download dialog                                                |
| duration               | stored once on the video, from the first rendition to finish                              |
