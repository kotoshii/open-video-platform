## Set retention for traces, logs and metrics

Needs: [Task-24 — Run Loki, Tempo and Prometheus as separate containers](Task-24-Run-Loki-Tempo-and-Prometheus-as-separate-containers.md)

Keep traces for 3 days, logs for 7 and metrics for 15, roughly 10–20 GB for all of it together.

* Turn on retention in Loki's compactor — a retention period on its own deletes nothing.
* Give Prometheus both a time limit and a size limit.
* Set Tempo's retention in its compactor.

Why: a burst of new series can fill the disk long before a time limit alone applies.
