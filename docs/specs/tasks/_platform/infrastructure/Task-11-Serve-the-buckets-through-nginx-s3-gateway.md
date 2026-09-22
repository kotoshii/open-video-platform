## Serve the buckets through nginx-s3-gateway

Needs: [Task-07 — Create MinIO buckets and lifecycle rules](Task-07-Create-MinIO-buckets-and-lifecycle-rules.md)

Add nginx-s3-gateway in front of the private buckets, so the gateway can serve HLS playlists, segments, thumbnails and
avatars while the buckets stay private. First check whether one instance can serve several buckets; if not, run one per
bucket — `s3-gateway-videos` and `s3-gateway-avatars` — as the gateway template already expects.

Why: every bucket stays private and nginx decides access by route, while nginx-s3-gateway signs its requests to MinIO
with SigV4 ([US-Videos-05](../../../user-stories/videos/US-Videos-05-Upload-videos.md)).
