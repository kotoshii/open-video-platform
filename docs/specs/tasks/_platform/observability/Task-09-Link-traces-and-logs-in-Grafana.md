## Link traces and logs in Grafana

Needs: [Task-03 — Ship container logs to Loki with Alloy](Task-03-Ship-container-logs-to-Loki-with-Alloy.md),
[Task-05 — Add trace ids to every log line](Task-05-Add-trace-ids-to-every-log-line.md)

Configure the Grafana data sources so a trace links to its logs, and a log line with a trace id links to its trace. It
works when a log line from `video-rate-count-worker` opens the trace of the like that caused it.

Why: debugging starts from either side and almost always needs the other.
