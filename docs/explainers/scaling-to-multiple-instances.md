# Running more than one instance of everything

What happens when each service runs as several processes instead of one: what already works, what silently breaks, and
what has to be built differently because of it.

The goal is not autoscaling. It is that **nothing in the system assumes it is alone**, so that
`docker compose up --scale video-upload-api=3` is a boring thing to do rather than a discovery exercise.

Related: [sse-progress-and-redis-pubsub.md](sse-progress-and-redis-pubsub.md) — one instance of this problem, solved in
full. [kafka-dedup-and-inbox-pattern.md](kafka-dedup-and-inbox-pattern.md) — the outbox relay in Part 9 is one of the
components that needs a decision here.

---

## Part 1 — The rule everything follows

**Shared state lives in Postgres or Redis. Never in the process.**

That single rule is why most of the platform already survives being run twice, and every problem below is a place where
something breaks it — a cached hostname, a timer, a connection that belongs to one process.

## Part 2 — What already works

Worth knowing what not to worry about:

* **Authentication is stateless.** The access token is validated against Keycloak's JWKS
  ([US-Auth-04](../specs/user-stories/auth/US-Auth-04-Session-persistence.md)), so any instance can verify any request. No
  server-side session, so **no sticky sessions are needed** — which is what makes everything else here tractable.
* **The acting channel travels in a header**
  ([US-Channels-02](../specs/user-stories/channels/US-Channels-02-freely-switch-between-channels.md)),
  validated against the token's `channelIds` claim. Nothing about the current channel lives on a server.
* **Short-lived tokens, cooldowns and view deduplication are already in Redis**, shared by every instance. A resend
  cooldown ([US-Auth-02](../specs/user-stories/auth/US-Auth-02-Account-confirmation.md)) enforced in process memory would
  reset itself depending on which instance answered.
* **Races are settled by the database, not by application checks.** The unique constraint on an active upload session
  ([US-Videos-05](../specs/user-stories/videos/US-Videos-05-Upload-videos.md)) and the partial unique index on open
  notifications ([notification-aggregation.md](notification-aggregation.md)) work exactly as well across ten instances
  as within one, because Postgres is the thing deciding. A check-then-insert in application code would not.
* **Kafka events are keyed by entity id** — `videoId`, `commentId`. This matters more than it looks: see Part 3.

The JWKS cache and the paused-history flag cache
([US-My-activity-01](../specs/user-stories/my-activity/US-My-activity-01-Watch-history.md))
are per-instance, which is fine. They are caches of external truth, not state — the worst case is one instance being a
few seconds stale.

## Part 3 — Kafka consumers: the part that scales by itself

Every worker joins a consumer group (`groupId` in its config). Kafka hands each partition of a topic to exactly one
consumer in the group, so starting a second instance of `video-rate-count-worker` splits the partitions between them.
No code changes, no coordination.

Two consequences:

* **The partition count is the ceiling.** Four partitions means at most four useful instances; a fifth sits idle. If a
  worker is ever the bottleneck, the topic needs more partitions, and that is decided when the topic is created.
* **Ordering survives, because of the keys.** Kafka only guarantees order within a partition, and the partition is
  chosen by the key. Since every rate event for one comment carries that `commentId`, all of its events land on one
  partition and are handled by one worker in order. Create, switch, delete stay in sequence. **Keying by entity id is
  what makes the counters safe to parallelise** — round-robin keys would produce a worker applying a delete before the
  create it belongs to.

What does *not* survive: the deduplication bug in [known-issues.md](../known-issues.md). With one worker a poisoned
batch freezes one partition; with several, each instance can poison its own, and the symptom becomes much harder to
read. The inbox fix is a prerequisite for running workers in parallel, not an improvement on it.

`partitionsConsumedConcurrently: 1` also caps each instance to one partition at a time, which is worth revisiting once
the inbox makes concurrency safe to reason about.

## Part 4 — The gateway will not notice the new instances

This is the trap most likely to waste an afternoon.

`docker/nginx/templates/default.conf.template` declares each upstream as a single server:

```
upstream api-video { server video-api:3000; }
```

Nginx resolves that hostname **once, at startup**, and caches the address for the life of the process. Scale the
service to three replicas and Docker's DNS will happily return three addresses — but nginx already has one and will
keep sending every request to it. Nothing errors; the extra instances simply sit idle, which looks exactly like "the
app does not get faster when I scale it".

The fix is to resolve at request time, using Docker's embedded DNS and a variable in `proxy_pass` so nginx cannot
cache the result:

```
resolver 127.0.0.11 valid=10s ipv6=off;

location /video/ {
    set $upstream http://video-api:3000;
    proxy_pass $upstream;
}
```

Two details worth knowing before doing this:

* A variable in `proxy_pass` changes how nginx handles the URI, so the rewrite rules have to be written with that in
  mind rather than added on afterwards.
* Token validation does not have this problem any more: the gateway verifies the token itself rather than asking
  `auth-api` through an `auth_request` subrequest ([infrastructure.md](../specs/infrastructure.md)). A subrequest added
  back later would need the same treatment, or every request in the system would be validated by one instance.

## Part 5 — A client's connection lives on one instance

Upload progress is the worked example, and it is already decided: the SSE connection is held by one `video-upload-api`
instance while the Kafka event about that upload may be consumed by another, so progress is relayed through Redis
pub/sub. The reasoning, including why sticky routing does not help, is in
[sse-progress-and-redis-pubsub.md](sse-progress-and-redis-pubsub.md).

The general shape is worth naming, because it will come back for anything else long-lived: **a connection is state, and
it is state that cannot be moved to Redis.** Only the *notification* can be. Anything pushed to a connected client has
to be broadcast to every instance, and every instance decides whether it holds that client.

The trap from that document applies to the whole of this one: with a single instance, code that ignores this works
perfectly.

## Part 6 — Scheduled work runs on every instance

Nothing in the code schedules anything yet, so this is a decision to take before the first timer is written rather than
a bug to fix. The specs already call for several:

* expiring upload sessions older than a day ([US-Videos-05](../specs/user-stories/videos/US-Videos-05-Upload-videos.md));
* running channel and account purges when their week is up, plus the sweep for schedules whose job was lost
  ([US-Channels-06](../specs/user-stories/channels/US-Channels-06-delete-own-channel.md));
* flushing batched notification emails at the end of their window
  ([US-Notifications-03](../specs/user-stories/notifications/US-Notifications-03-Email-channel.md)).

A Nest `@Cron` or `@Interval` fires **in every process that is running**. Three instances means three purges of the
same channel, three flushes of the same batch, three emails in somebody's inbox. Idempotency limits the damage but is
not a design.

Three ways out, in the order I would reach for them:

1. **BullMQ repeatable and delayed jobs.** BullMQ keeps its schedule in Redis, so the job exists once no matter how
   many instances are running, and whichever worker is free picks it up. It is already in the stack for video
   processing, and the deletion purges are described as delayed jobs already. This is the default answer.
2. **A Postgres advisory lock.** `pg_try_advisory_lock` around the body of the timer: every instance wakes up, one
   acquires the lock and does the work, the rest return immediately. Useful when a job does not fit the queue model.
3. **Leader election.** Real coordination, and more than this project needs.

Whichever is used, the schedule itself belongs in Postgres and the job is only the trigger — already decided for
deletions, and the reason is the same one as here: Redis losing its data must not mean a deletion silently never runs.

## Part 7 — The outbox relay needs exactly one publisher per key

Part 9 of [kafka-dedup-and-inbox-pattern.md](kafka-dedup-and-inbox-pattern.md) specifies a relay that reads the outbox
table in `id` order and publishes to Kafka. Run that in three instances unchanged and all three publish every row.

Ordering is what makes this awkward: the obvious fix, `SELECT ... FOR UPDATE SKIP LOCKED`, lets several relays work
without collisions but allows row 7 to be published before row 5 — which is precisely the ordering the keys were
protecting.

Two workable answers:

* **One relay at a time**, chosen by an advisory lock as in Part 6. Simplest, and the throughput of a single relay is
  far beyond what this project produces.
* **Shard by key.** Each relay claims rows whose key hashes into its share, so a given comment is always handled by one
  relay and its events keep their order. This is the same trick Kafka's partitioning uses, applied to the table.

Either way the rule is: **parallelise across keys, never within one.**

## Part 8 — Postgres connections multiply quietly

`lib/api/config/builders/kysely-module-config-builder.ts` builds its pool with nothing but a connection string:

```ts
pool: new Pool({connectionString: databaseConfig.databaseUrl})
```

`node-postgres` defaults to **10 connections per pool**, and each instance has its own pool. Nine API services at two
instances each is 180 connections; Postgres defaults to `max_connections = 100`. The failure mode is not gradual —
connections are refused, and the service that happens to start last is the one that breaks.

In the current setup each service has its own database, which spreads the load but does not change the arithmetic when
they share a server ([environments-explained.md](environments-explained.md)).

What to do, in order: set an explicit `max` per pool sized to what the service actually needs, raise
`max_connections` deliberately rather than by accident, and put **pgBouncer** in transaction mode in front of Postgres
if instance counts ever grow past a handful. Kysely works fine through pgBouncer in transaction mode as long as
session-level features are avoided.

## Part 9 — Uploads, and what to verify rather than assume

Resumable uploads are the one request flow with genuine server-side state: a tus upload is identified by its URL and
continued with `PATCH` requests that may land on any instance.

With tusd's S3 backend the upload's metadata lives in S3 alongside the parts, so in principle any instance can continue
any upload. What needs checking before running several tusd instances is **locking** — whether two instances can be
made to refuse to write to the same upload concurrently, since tusd's default locker is process-local. Treat this as an
open item to verify against the tusd version in use, not as something the design already covers.

The hooks are not a problem: they are plain HTTP calls from tusd into `video-upload-api`, and that service is stateless
apart from its SSE connections, which Part 5 already covers.

## Part 10 — The things that do not scale this way

Not every box is a Nest process, and the stateful ones each have their own answer:

| Component         | How it scales                                                                                          |
|-------------------|--------------------------------------------------------------------------------------------------------|
| **Postgres**      | One writer. Read replicas are the next step, and only for read-heavy paths; nothing here needs it yet. |
| **Keycloak**      | Clusterable, but needs its distributed cache configured — verify before running two.                   |
| **Redis**         | Must stay `noeviction` because BullMQ keeps jobs in it ([open-decisions.md](../open-decisions.md)).    |
| **Kafka**         | Scales by partitions and brokers, not by consumers alone — see Part 3.                                 |
| **MinIO**         | Scales on its own; the services only hold credentials.                                                 |
| **Elasticsearch** | Its own cluster concern, unrelated to how many API instances query it.                                 |
| **Gorse**         | External service with its own storage; the feed service only calls it.                                 |
| **tusd**          | See Part 9.                                                                                            |

## Part 11 — The checklist

| What                                   | State today                  | Needs                                                        |
|----------------------------------------|------------------------------|--------------------------------------------------------------|
| Stateless auth, channel in a header    | Works                        | —                                                            |
| Cooldowns, tokens, view dedup in Redis | Works                        | —                                                            |
| Races settled by unique constraints    | Works                        | Keep it that way; no check-then-insert                       |
| Kafka consumer groups                  | Works                        | Enough partitions; the inbox fix first                       |
| Gateway upstream resolution            | **Resolves once at startup** | `resolver` + variable `proxy_pass`                           |
| SSE progress                           | Decided, not built           | Redis pub/sub as specified                                   |
| Scheduled jobs                         | None yet                     | BullMQ repeatable jobs, or an advisory lock                  |
| Outbox relay                           | Not built                    | One publisher per key: advisory lock or shard by key         |
| Postgres connection pools              | **Unbounded default**        | Explicit `max`, then pgBouncer                               |
| tusd locking                           | Unknown                      | Verify before running several                                |

## Part 12 — How to actually find these

Run two of something and use it. That is the whole method, and it is the only one that works, because **every problem
in this document is invisible with a single instance.** The SSE bug, the cached nginx upstream, the duplicated cron,
the double-publishing relay — all of them behave perfectly until the second process starts.

```
docker compose up --scale video-upload-api=2 --scale comment-rate-api=2
```

Two is enough. The bugs are about the transition from one to many, not about how many.
