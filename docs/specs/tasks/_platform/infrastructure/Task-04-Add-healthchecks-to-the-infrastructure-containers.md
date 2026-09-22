## Add healthchecks to the infrastructure containers

Needs: [Task-01 — Split the Compose setup into per-environment files](Task-01-Split-the-Compose-setup-into-per-environment-files.md)

Give Postgres, Kafka, Keycloak, MinIO and Redis a healthcheck that tells whether the service can answer, and make
everything that uses them wait with `depends_on: condition: service_healthy`.

Why: plain `depends_on` waits for a container to start, not for the service inside to be ready, so apps crash while
Kafka or Keycloak is still starting up.
