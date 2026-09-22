## Create video-processing-worker

Needs: [_platform foundation Task-06 — Add Redis and BullMQ builders to lib](../../../_platform/foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

Create `video-processing-worker` in the new structure: a Kafka consumer, BullMQ queues, an S3 client and FFmpeg. Add it
to Compose with FFmpeg and ffprobe in its image, and give it its Kafka topics.

* It has no database. Its per-video state is the BullMQ flow from Task-15, and everything it produces reaches the other
  services as events.
* Set BullMQ concurrency to one or two per instance, and generous job timeouts.
* Every job works in a temp directory and uploads on success.

Why: FFmpeg saturates every core it is given, so without a concurrency limit several encodes on one machine make all of
them slow and starve whatever else runs there. A job killed halfway would otherwise leave partial files in the bucket
under names the rest of the system treats as finished.
