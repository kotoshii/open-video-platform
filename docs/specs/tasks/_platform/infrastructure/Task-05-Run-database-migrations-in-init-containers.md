## Run database migrations in init containers

Needs: [Task-03 — Create a database and user per service](Task-03-Create-a-database-and-user-per-service.md)

Add one init container per database that runs its dbmate migrations and exits, in a `migrations.yaml` piece of its own
that all three environments include — development too, where the apps run on the host. Apps depend on it with
`condition: service_completed_successfully`.

Why: an app never starts against a database whose tables don't exist yet, and nobody has to run migrations by hand on
a fresh machine.
