## Set the presign host per environment

Needs: [Task-02 — Add environment files and shared secrets](Task-02-Add-environment-files-and-shared-secrets.md)

Set MinIO's server URL (`MINIO_SERVER_URL`) and the services' public S3 endpoint through environment variables:
`storage.localhost` in preview and development, and the real host in production.

Why: a presigned signature covers the host, so a URL signed for `minio:9000` fails when the browser requests it through
the gateway ([infrastructure.md](../../../infrastructure.md), gateway prerequisites).
