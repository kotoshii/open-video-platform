## Write the video-upload-api README

Needs: [US-Videos-05 Task-02 — Migrate video-upload-api to the new structure](../../videos/US-Videos-05/backend/Task-02-Migrate-video-upload-api-to-the-new-structure.md)

Write `apps/api/video-upload-api/README.md`: a short overview of what the service owns, taken from
[service-map.md](../../../service-map.md), its environment variables, and how to run it — including the tus hooks,
`TUS_WEBHOOK_SECRET`, and running two instances to check upload progress through Redis pub/sub. Check its Swagger docs
while there: every endpoint shows its request, its responses and its error codes.
