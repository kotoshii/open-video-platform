## Add gateway spans with ngx_otel_module

Needs: [Task-10 — Spike: Can ngx_otel_module run in the gateway image](Task-10-Spike-Can-ngx_otel_module-run-in-the-gateway-image.md),
[Task-06 — Check that the gateway passes traceparent through](Task-06-Check-that-the-gateway-passes-traceparent-through.md)

Add the module so nginx creates its own span and traces start at the edge, and add the module's trace id variable to the
JSON access log. It works when a trace starts at nginx and shows the time spent verifying the token, and HLS segment
requests show up as traces of their own.

Why: the gateway verifies tokens, checks channel ids and guards HLS segments, and segment requests never reach a Node
service — without spans of its own, none of that work is visible in traces.
