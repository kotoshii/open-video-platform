# Infrastructure

Setup requirements for the local stack that do not belong to any user story. Observability has its own plan in
[observability-plan.md](./observability-plan.md).

---

## Gateway prerequisites

What the gateway configuration (`docker/nginx/templates/default.conf.template`) needs from the rest of the stack before
it can run.

* [ ] **tusd runs with `-behind-proxy`**, so it builds upload URLs from the `X-Forwarded-Host` and `X-Forwarded-Proto`
      headers the gateway sets. Without it, tusd hands the browser upload URLs that point at its own internal address.
* [ ] **MinIO presigns for `storage.localhost`** (`MINIO_SERVER_URL`). A presigned signature covers the host, so a URL
      signed for `minio:9000` fails when the browser requests it through the gateway.
* [ ] **auth-api exposes `/auth/verify`** for the gateway's subrequest: 200 with `User-ID` and `Channel-ID` response
      headers when the access token in the cookie is valid and `X-Channel-Id` is one of its channels; 401 for a missing
      or invalid token; 403 for a channel that does not belong to the account.
* [ ] **One nginx-s3-gateway instance per bucket** — `s3-gateway-videos` and `s3-gateway-avatars`. Check whether a
      single instance can serve several buckets before running two.
* [ ] **Shared secrets are set in the environment**: `HLS_SECURE_LINK_SECRET` for the gateway and video-api, and
      `TUS_WEBHOOK_SECRET` for the gateway and video-upload-api.
