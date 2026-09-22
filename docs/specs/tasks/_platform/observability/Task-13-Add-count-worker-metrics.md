## Add count worker metrics

Needs: [known-issues Task-02 — Rebuild the count worker base on the inbox](../known-issues/Task-02-Rebuild-the-count-worker-base-on-the-inbox.md),
[Task-04 — Create the tracing bootstrap in lib](Task-04-Create-the-tracing-bootstrap-in-lib.md)

Add metrics to the count workers' shared base: batch size, batch processing duration, failed batches, and events
skipped as duplicates.

Why: a stuck partition writes no error log. These numbers, next to consumer lag, are what show it.
