## Add trace ids to every log line

Needs: [Task-02 — Add a JSON logger to lib](Task-02-Add-a-JSON-logger-to-lib.md),
[Task-04 — Create the tracing bootstrap in lib](Task-04-Create-the-tracing-bootstrap-in-lib.md)

Add `trace_id` and `span_id` from the active OpenTelemetry context to every log line, so a line written during a request
carries that request's trace id.

Why: the trace id is what leads from a log line to its trace and back.
