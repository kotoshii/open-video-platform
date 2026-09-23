## Collect Kafka consumer lag with Alloy

Needs: [Task-03 — Ship container logs to Loki with Alloy](Task-03-Ship-container-logs-to-Loki-with-Alloy.md)

Collect consumer lag per consumer group with Alloy's built-in Kafka exporter, so no separate exporter container is
needed. Alloy connects with a Kafka user of its own
([security Task-02](../security/Task-02-Turn-on-SCRAM-authentication-in-Kafka.md)).

The phase is done when Prometheus shows lag for every worker and request metrics for every service
([observability-plan.md](../../../observability-plan.md), Phase 4).

Why: lag is the most important metric in this project. A partition stuck on a poisoned batch shows up as lag that only
grows, with no error log anywhere ([known-issues.md](../../../../known-issues.md)).
