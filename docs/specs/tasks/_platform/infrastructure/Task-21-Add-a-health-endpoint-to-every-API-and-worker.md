## Add a health endpoint to every API and worker

Needs: [Task-20 — Add the apps to Compose](Task-20-Add-the-apps-to-Compose.md)

Add a shared health module to `lib` that answers whether the app can reach what it needs — its database, Kafka, Redis —
and use it in every API and worker. Workers get a small HTTP listener just for it. Give every app a Compose healthcheck
that calls it.

Why: the gateway, `docker compose up --wait` and the CI smoke test all trust healthchecks, and an app without one counts
as ready the moment its process starts, before it can answer
([ci-with-github-actions.md](../../../../explainers/ci-with-github-actions.md), Part 8).
