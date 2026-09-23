## Create MinIO buckets and lifecycle rules

Needs: [Task-04 — Add healthchecks to the infrastructure containers](Task-04-Add-healthchecks-to-the-infrastructure-containers.md)

Add an init container that creates one bucket per purpose — videos, avatars, data exports — with their lifecycle rules:

* videos: abort incomplete multipart uploads after a day. This is how the bytes of an abandoned upload expire, since
  tusd has no expiry of its own ([US-Videos-05](../../../user-stories/videos/US-Videos-05-Upload-videos.md));
* exports: expire objects after a day, as a floor under a missed deletion job
  ([US-Account-04](../../../user-stories/account/US-Account-04-Download-own-user-data.md)).

Apps depend on it with `condition: service_completed_successfully`.

Why: the buckets and their rules exist before any app writes to them, on every fresh machine.
