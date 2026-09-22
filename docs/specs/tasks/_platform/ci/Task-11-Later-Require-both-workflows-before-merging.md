## Later: Require both workflows before merging

Needs: [Task-08 — Add the preview smoke test workflow](Task-08-Add-the-preview-smoke-test-workflow.md)

Make the checks and the smoke test required in the branch protection for `master`, once both pass reliably.

Why: a flaky required check blocks every merge.
