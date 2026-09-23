## Link batch spans to the traces of their messages

Needs: [Task-07 — Carry trace context through the outbox and Kafka](Task-07-Carry-trace-context-through-the-outbox-and-Kafka.md)

In the batch workers, create one span per batch, with a span link to each message's trace context instead of a parent.

Why: a batch serves many traces at once, and a span can have only one parent.
