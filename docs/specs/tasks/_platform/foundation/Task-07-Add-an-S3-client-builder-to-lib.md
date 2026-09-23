## Add an S3 client builder to lib

Add a builder to `lib/api` for an S3 client pointed at MinIO, with the endpoint, the credentials and the bucket names
from environment variables. Presigned URLs are signed for a separate public endpoint (`S3_PUBLIC_ENDPOINT`), because
the browser reaches MinIO through `storage.localhost`, not `minio:9000`.

Add the few helpers several services need: presign a download with a `Content-Disposition` file name, copy an object
inside a bucket, and delete everything under a prefix.

Why: the host is part of a presigned URL's signature, so a URL signed for the internal address fails in the browser
with no hint why ([infrastructure.md](../../../infrastructure.md), gateway prerequisites).
