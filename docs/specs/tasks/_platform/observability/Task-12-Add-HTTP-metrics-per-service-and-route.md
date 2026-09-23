## Add HTTP metrics per service and route

Needs: [Task-04 — Create the tracing bootstrap in lib](Task-04-Create-the-tracing-bootstrap-in-lib.md)

Export request rate, error rate and duration per service and route from the HTTP instrumentation, and check they reach
Prometheus. The route label is the route template (`/videos/:id`), never the raw path — no ids and no user input in
labels.

Why: a label per raw path creates a new series for every id, and the series pile up until Prometheus runs out of
memory.
