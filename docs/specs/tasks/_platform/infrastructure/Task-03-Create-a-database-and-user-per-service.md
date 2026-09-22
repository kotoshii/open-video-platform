## Create a database and user per service

Needs: [Task-01 — Split the Compose setup into per-environment files](Task-01-Split-the-Compose-setup-into-per-environment-files.md)

Add the init script for the shared Postgres server: one database and one user per service, each user allowed into its
own database only. In `postgres.isolated.yaml`, run one Postgres server per service that needs one, with the same
database and user names, so a service's settings look the same everywhere.

Revoke `CONNECT` from `PUBLIC` on every database, grant it to the owning user, and grant that user the `public` schema
([environments-explained.md](../../../../explainers/environments-explained.md), Part 3).

Why: Postgres lets every user connect to every database by default. Without the `REVOKE` everything works and nothing
is isolated, and a query reaching into another service's database only fails once it hits production.
