## Add a push contact point for alerts

Needs: [Task-22 — Alert on consumer lag and failed batches](Task-22-Alert-on-consumer-lag-and-failed-batches.md)

Once the stack runs unattended anywhere, add one push contact point in Grafana — a Telegram or Discord webhook —
provisioned from a file.

Why: alerts never travel through the platform's own email module or Kafka. An alert saying Kafka is down can't be
delivered through Kafka, so Grafana reaches the outside world on its own.
