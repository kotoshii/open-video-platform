## Run tusd behind the gateway

Needs: [Task-07 — Create MinIO buckets and lifecycle rules](Task-07-Create-MinIO-buckets-and-lifecycle-rules.md)

Add tusd to `infra.yaml` with the MinIO videos bucket as its storage, its HTTP hooks pointed at video-upload-api, and the
`User-ID`, `Channel-ID` and `Tus-Webhook-Secret` headers forwarded to the hooks. Run it with `-behind-proxy`.

Why: behind a proxy, tusd builds upload URLs from the `X-Forwarded-Host` and `X-Forwarded-Proto` headers the gateway
sets. Without the flag it hands the browser upload URLs that point at its own internal address.
