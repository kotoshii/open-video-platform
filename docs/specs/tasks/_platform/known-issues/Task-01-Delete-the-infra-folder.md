## Delete the infra folder

Needs: [infrastructure Task-01 — Split the Compose setup into per-environment files](../infrastructure/Task-01-Split-the-Compose-setup-into-per-environment-files.md)

Delete `infra/`. The old `docker/docker-compose.local.yml` mounts three files from it, so check nothing references the
folder once that file is gone.

Why: its gateway config contradicts the current one, and anyone reading it designs against a layout that no longer
exists ([known-issues.md](../../../../known-issues.md)).
