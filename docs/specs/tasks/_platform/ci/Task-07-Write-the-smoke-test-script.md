## Write the smoke test script

Needs: [Task-06 — Add the CI environment file](Task-06-Add-the-CI-environment-file.md)

Write `scripts/smoke-test.sh`, with `curl` and `jq`, that walks one real path through the gateway.

Main flow:

1. Sign up, keeping the auth cookies.
2. Initialise an upload, create a tus upload and send the whole file in one `PATCH`.
3. Poll the upload's status every few seconds until the lowest quality is ready.
4. Publish the video, call the watch endpoint, fetch the master playlist it returns, and check it lists at least one
   rendition.

Branch — a poll reaches its deadline:

1. Fail with a message naming the step that timed out.

Why: that one path goes through the gateway, Keycloak, the sign-up saga, tus and its hooks, Kafka, BullMQ, FFmpeg,
MinIO and the HLS token check. It polls instead of sleeping because processing is eventually consistent — a fixed
`sleep` passes on a quiet day and fails on a slow one.
