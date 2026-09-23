## Check that the gateway passes traceparent through

Needs: [Task-04 — Create the tracing bootstrap in lib](Task-04-Create-the-tracing-bootstrap-in-lib.md)

Check that nginx passes the `traceparent` header on to the services unchanged, so the first Node service continues a
trace that started before it. For now traces start at that service; the gateway gets spans of its own in Task-11.
