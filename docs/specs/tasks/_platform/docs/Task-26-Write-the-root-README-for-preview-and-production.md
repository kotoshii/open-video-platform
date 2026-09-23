## Write the root README for preview and production

Needs: [infrastructure Task-20 — Add the apps to Compose](../infrastructure/Task-20-Add-the-apps-to-Compose.md)

Rewrite the setup and run instructions in the root README for the preview and production environments, following
[environments-explained.md](../../../../explainers/environments-explained.md): what to install, the `.env` to create
from the example, `docker compose up` for preview, `COMPOSE_FILE=compose.prod.yaml` for production, the observability
profile, and where each UI is reached — the app, Swagger, Grafana, the mail catcher, Kafka UI.
