## Resolve offsets for skipped and malformed messages

Needs: [Task-02 — Rebuild the count worker base on the inbox](Task-02-Rebuild-the-count-worker-base-on-the-inbox.md)

After the transaction commits, resolve the offset of every message in the batch — duplicates and messages that failed
to parse included — and log the ones that failed to parse.

Why: skipping a message is still handling it. Today a batch of nothing but duplicates is delivered again forever, and a
single malformed message blocks its partition for good
([kafka-dedup-and-inbox-pattern.md](../../../../explainers/kafka-dedup-and-inbox-pattern.md), Part 4).
