## Add the apps to Compose

Needs: [Task-05 — Run database migrations in init containers](Task-05-Run-database-migrations-in-init-containers.md),
[Task-06 — Create Kafka topics in an init container](Task-06-Create-Kafka-topics-in-an-init-container.md),
[Task-18 — Build every Nest app from one Dockerfile](Task-18-Build-every-Nest-app-from-one-Dockerfile.md),
[Task-19 — Build the UI image from the standalone output](Task-19-Build-the-UI-image-from-the-standalone-output.md)

Add every API and worker that exists, and the UI, to `apps.yaml`, built from the two Dockerfiles. Each one waits for
the infrastructure it uses to be healthy and for its migrations and the topic init to complete. A service created later
adds itself here in its own create task.

Why: on a cold start the order then falls out by itself — infrastructure, healthy, init jobs finished, apps, gateway
([environments-explained.md](../../../../explainers/environments-explained.md), Part 5).
