# Known issues

Problems found in the existing implementation that do not belong to any user story. Fix them when the service in
question is reworked.

## Kafka dedup can permanently drop count updates

**Full write-up:** [kafka-dedup-and-inbox-pattern.md](./kafka-dedup-and-inbox-pattern.md) — how the deduplication
works, why it breaks, what the inbox pattern is, and a step-by-step fix.

**Where:** `lib/api/kafka/services/kafka-deduplication.service.ts`, used by every count worker through
`lib/workers/counts/services/base-count-worker.service.ts`.

**What happens:** the worker marks event ids as "already handled" in Redis *before* the counts are written to Postgres.
If the database write then fails, the worker returns without committing the Kafka offsets, so Kafka redelivers the
batch — but the ids are already marked, so every event in it is filtered out as a duplicate. The batch is processed as
empty: nothing is written, and no offsets are resolved. Kafka delivers the same batch again, with the same result.

**Why it matters:** the partition stops making progress, so everything queued behind that batch waits with it, and the
counts from those events are lost until the Redis keys expire. Likes, dislikes, comment counts and subscriber counts
drift silently.

**Root cause:** "I have handled this event" is recorded in Redis while the result of handling it is recorded in
Postgres, with no way to undo the first when the second fails.

**Fix:** record the processed event ids in Postgres inside the same transaction as the count update — the inbox
pattern — so that marking an event handled and applying its effect succeed or fail together. A unique constraint on the
event id then filters duplicates. Redis can stay as a fast pre-filter, but must not be the authority.

A cheaper stopgap is to release the reservations in the error path, but that still leaves a gap if the worker crashes
before the cleanup runs.

**Also in the same code:** offsets are resolved only for events that survive deduplication, so a batch made entirely
of duplicates is redelivered forever; and messages that fail to parse are dropped without resolving their offsets, so
one malformed message blocks the partition permanently. Both are covered in the write-up.

**Related:** the same file already carries a TODO about several worker instances consuming one topic — the same class of
problem.

## View deduplication key is missing the video id

**Where:** `apps/workers/video-view-count-worker/src/video-view-counts/services/views-deduplication.service.ts`.

**What happens:** `buildRedisKey` builds the reservation key from the viewer alone — `video-view:<viewerId>`, or
`video-view:<ip_userAgent>` when there is no viewer. The video id is never part of the key, even though the event
payload carries it.

The intent is "count one view per viewer per video within the TTL". What it actually does is "count one view per
viewer, full stop": once someone watches any video, views of every *other* video by that same viewer are discarded
until the key expires.

**Why it matters:** view counts across the platform are silently far too low, and the more a person watches, the fewer
of their views are counted.

**Fix:** include the video id in the key, e.g. `video-view:<videoId>:<viewerId>`. The payload already has `videoId`,
so it is a one-line change in `buildRedisKeyForViewerId` and `buildRedisKeyForIpAndUA`, which need the id passed in.

**While in there:** the `btoa` around the ids only obfuscates them and is not needed — ids are already safe as key
segments. Anonymous viewing is also not planned any more, so the IP and user agent branch is currently unreachable.
