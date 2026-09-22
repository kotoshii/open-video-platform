## Alert on consumer lag and failed batches

Needs: [Task-18 — Add the Kafka workers dashboard](Task-18-Add-the-Kafka-workers-dashboard.md)

Add Grafana alert rules, provisioned from files like the dashboards: consumer lag growing for several minutes in a row,
and failed batches in any count worker. While the stack runs only on the development machine, alerts show in the
Grafana UI only.

Add them once the dashboards have shown what normal looks like, or they fire constantly.

Why: lag that keeps growing is how the stuck partition from [known-issues.md](../../../../known-issues.md) shows itself —
it produces no error log at all.
