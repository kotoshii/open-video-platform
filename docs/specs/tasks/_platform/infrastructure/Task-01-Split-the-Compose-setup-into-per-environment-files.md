## Split the Compose setup into per-environment files

Replace `docker/docker-compose.local.yml` with the layout from
[environments-explained.md](../../../../explainers/environments-explained.md), Part 4: pieces under `docker/compose/` —
`infra.yaml`, `postgres.shared.yaml`, `postgres.isolated.yaml`, `migrations.yaml`, `apps.yaml`, `observability.yaml` —
and three top-level files that assemble them with `include:`.

* `compose.yaml` (preview): infra, the shared Postgres, the migrations, the apps.
* `compose.prod.yaml`: infra, one Postgres per service, the migrations, the apps.
* `compose.dev.yaml`: infra, the shared Postgres and the migrations, no apps.
* `COMPOSE_FILE` in a machine's `.env` picks the environment, so a bare `docker compose up` works everywhere.
* `infra.yaml` starts with Kafka, Kafka UI, Redis, MinIO and the nginx gateway; later tasks add to it.
* Pin every image version instead of `latest`, and keep persistent data under `docker_data/`.
* Run Redis with `maxmemory-policy noeviction`.

Why: one small file per environment stays readable, where profiles for shared versus isolated Postgres would turn into
a tangle of conditions. Redis must never evict, because BullMQ keeps its jobs there and an eviction policy can silently
delete queued jobs under memory pressure.
