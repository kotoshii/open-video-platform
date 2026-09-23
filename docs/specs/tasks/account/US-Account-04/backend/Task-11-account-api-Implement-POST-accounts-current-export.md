## account-api: Implement POST /accounts/current/export

Needs: [Task-01 — auth-api: Verify a password over gRPC](Task-01-auth-api-Verify-a-password-over-gRPC.md),
[Task-10 — account-api: Collect the account's data into an archive](Task-10-account-api-Collect-the-accounts-data-into-an-archive.md),
[_platform infrastructure Task-07 — Create MinIO buckets and lifecycle rules](../../../_platform/infrastructure/Task-07-Create-MinIO-buckets-and-lifecycle-rules.md)

`POST /accounts/current/export` — body `{ password }`

Main flow:

1. Ask `auth-api` to verify the password.
2. If the last export is less than an hour old, sign a URL for the stored archive that expires when the archive does.
3. Otherwise collect a fresh archive, overwrite the account's one object in the exports bucket, set the last export
   time, and schedule a BullMQ delayed job that deletes the object an hour later.
4. Return the presigned URL, with `Content-Disposition` naming the file after the platform and the export date.

`GET /accounts/current` returns the last export time from now on, and the account purge
([US-Account-01 Task-08](../../US-Account-01/backend/Task-08-account-api-Run-the-account-purge-as-a-saga.md)) deletes
the stored archive and its job before it deletes the identity.

Branch — the password is wrong:

1. A field-level error; nothing is exported.

Branch — collecting fails:

1. Its error; no archive is stored and the last export time is untouched, so the next attempt is allowed at once.

The hour between exports, the link's lifetime and the archive's lifetime are one value — a link issued for an already
stored archive must expire when that archive does, not an hour after it was issued.

Why: S3 lifecycle rules expire objects by the day, so the one-hour deletion is a delayed job, and the bucket's one-day
rule is only a floor under a job that went missing. The API checks the password and hands out a URL, so the download
itself never occupies an API process.
