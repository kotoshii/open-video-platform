## Carry trace context through the outbox and Kafka

Needs: [Task-04 — Create the tracing bootstrap in lib](Task-04-Create-the-tracing-bootstrap-in-lib.md),
[foundation Task-11 — Add the outbox relay to lib](../foundation/Task-11-Add-the-outbox-relay-to-lib.md)

Make a producer's span and the consumer span that handles its message end up in one trace. The `kafkajs`
instrumentation does this for a direct send, but events go through the outbox: have the relay publish each row with the
`traceparent` stored on it as the parent context, so the Kafka headers carry the original trace on.

The phase is done when liking a video produces one trace from `video-rate-api` through Kafka into
`video-rate-count-worker` ([observability-plan.md](../../../observability-plan.md), Phase 3).

Why: the relay publishes a moment later, outside the request, so without the stored context every event starts a new
trace — the most common place for tracing to break without an error.
