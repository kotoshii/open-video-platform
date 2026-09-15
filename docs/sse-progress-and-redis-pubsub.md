# Upload progress across several instances: SSE and Redis pub/sub

Why live upload progress breaks as soon as a second video-upload instance runs, why sticky routing does not fix it, what
Redis pub/sub is, and how it is used here.

Related: [US-Videos-05](./user-stories/videos/US-Videos-05-Upload-videos.md).

---

## Part 1 — What SSE is

SSE (Server-Sent Events) is a way for the server to keep sending messages to the browser over one HTTP request.

A normal HTTP request is: the browser asks, the server answers, the connection closes. With SSE the server answers but
**does not close the response**. It keeps it open and writes a new message into it whenever something happens:

```text
data: {"status":"uploaded"}

data: {"quality":"240p","ready":true}

data: {"quality":"720p","ready":true}
```

The browser's `EventSource` reads each message as it arrives. If the connection drops, `EventSource` reconnects by
itself.

The important detail for everything below: **an open SSE connection is an object in the memory of one specific
process.** Only that process can write to it. Another instance of the same service has no way to reach it.

## Part 2 — How progress works with one instance

1. The browser opens the uploading page and connects over SSE to the video-upload service.
2. The service keeps that connection in memory, in a map from video id to open connections.
3. The video-processing worker finishes the 480p version and posts `VideoQualityReady` to Kafka.
4. The video-upload service consumes the event, updates the status in its database, looks up video 42 in its map, finds
   the connection, and writes the update into it.
5. The browser shows "480p ready".

With a single instance, steps 2 and 4 happen in the same process, so the lookup always finds the connection.

## Part 3 — What changes with two instances

Run two instances, A and B. Two separate decisions are now made, by two separate systems, with nothing connecting them:

* **Which instance holds the browser's connection** — decided by Nginx, which spreads incoming connections across A and
  B.
* **Which instance consumes the Kafka event** — decided by Kafka, which splits the topic's partitions between the
  instances in the consumer group.

So this happens:

1. The browser's SSE connection lands on **A**.
2. The `VideoQualityReady` event for video 42 is consumed by **B**.
3. B looks up video 42 in its map. It has no connection for it — that connection lives in A's memory.
4. B updates the database and moves on.
5. A never hears about the event. The browser shows nothing.

Roughly half of all uploads stop showing progress, at random.

And nothing reports it. B did not fail — it simply found no connection, which is also what happens when a user has
closed the tab. No error, no log line worth noticing. That is why this is called a silent failure.

## Part 4 — Why sticky routing does not fix it

"Sticky routing" means Nginx sends the same client to the same instance every time. It sounds like the answer, and it is
not, because it only controls the first of the two decisions from Part 3.

Sticky routing makes sure the browser keeps reconnecting to A. It has no influence on Kafka, which still hands the event
to whichever instance owns that partition — which may well be B.

Partitioning Kafka by video id does not rescue it either. That controls *which partition* a video's events go to, not
*which instance* reads that partition — and Kafka reassigns partitions whenever an instance starts, stops or restarts.
Nginx knows nothing about any of that.

The connection and the event are placed by two independent systems. Making one of them sticky does not make them meet.

## Part 5 — What pub/sub is

Pub/sub means **publish / subscribe**, and Redis has it built in.

* Anyone can **publish** a message to a named channel — say `upload-progress:42`.
* Anyone can **subscribe** to a channel.
* When a message is published, Redis immediately hands it to **everyone currently subscribed** to that channel.

Think of a radio station. The station broadcasts, and whoever is tuned in hears it. Nobody tuned in? The broadcast
still happens, and nobody hears it. Nothing is recorded for later.

That last part matters: **Redis stores nothing.** A message published to a channel with no subscribers is simply gone.

## Part 6 — The fix, step by step

Every video-upload instance does two things: it subscribes for the videos it holds connections for, and it publishes
the events it consumes.

1. The browser connects over SSE to **A**, for video 42.
2. A subscribes to the Redis channel `upload-progress:42`.
3. The worker finishes 480p and posts `VideoQualityReady` to Kafka.
4. **B** consumes the event.
5. B updates the upload status in the database — the database is the source of truth.
6. B publishes `{"videoId":42,"quality":"480p","ready":true}` to `upload-progress:42`.
7. Redis delivers it to A, because A is subscribed.
8. A writes it into the browser's SSE connection. The browser shows "480p ready".
9. When the browser disconnects and A has no more connections for video 42, A unsubscribes from the channel.

B never needed to know where the connection was. It publishes to the channel for the video, and whoever holds the
connection receives it — A, B, or a tenth instance.

## Part 7 — Messages can be lost, and why that is fine

Because Redis stores nothing (Part 5), a published message can be missed:

* A is restarting at the moment B publishes.
* The browser has just reconnected, and A has not subscribed yet.
* A network hiccup between A and Redis.

This property is called **at-most-once** delivery: a message arrives once, or not at all.

It is fine here because of one rule: **pub/sub carries notifications, never state.**

The actual status of the upload — which qualities are ready, whether processing has finished — is stored in the
database in step 5. The pub/sub message only says "something changed, here it is". So whenever a browser connects, or
`EventSource` reconnects after a drop, the server does this:

1. **Subscribe** to the video's channel.
2. **Read the current status** from the database and send it to the browser.
3. **Forward live updates** from the channel from then on.

A missed message costs nothing. The next reconnect sends the true state from the database anyway.

The order in that list is deliberate. If the server read the status first and subscribed second, an update published in
the gap between the two would be lost with nothing to recover it. Subscribing first closes that gap. The price is that
the browser may occasionally receive the same update twice — harmless, because "480p is ready" is a fact rather than a
change: receiving it twice leaves the page exactly as receiving it once.

## Part 8 — Why pub/sub needs its own Redis connection

Once a Redis connection subscribes to a channel, it switches into subscribe mode and can do nothing else but wait for
messages. It cannot run any other command.

BullMQ also uses Redis, for video-processing jobs. If both shared one connection, the subscription would block BullMQ.
So the service opens a separate Redis connection dedicated to pub/sub.

## Part 9 — The trap: one instance hides all of this

With a single video-upload instance, the connection and the Kafka consumer are always the same process (Part 2).
Progress works perfectly even if the pub/sub step is missing entirely, or is wired up wrongly.

The bug only appears once a second instance runs — which is usually long after the code was written, when nobody
remembers this part.

So **test with at least two instances from the start.** With Docker Compose that is:

```text
docker compose up --scale video-upload=2
```

Then start several uploads at once. With pub/sub working, every one of them shows progress. If only some of them do, the
publish or the subscribe step is broken.

## Part 10 — The alternatives, briefly

* **Every instance consumes every event.** Give each instance its own Kafka consumer group, so all of them receive all
  events, and each one checks whether it holds a matching connection. It works without Redis, but every instance
  processes every event, and consumer groups created per running instance are awkward to manage.
* **Redis Streams instead of pub/sub.** Streams store messages and can deliver them again later. That would remove the
  "messages can be lost" concern — but Part 7 already makes that concern harmless, because the state lives in the
  database. Streams would add complexity without adding safety.
* **A single video-upload instance.** Avoids the problem entirely, and also avoids the thing this project exists to
  practise.
