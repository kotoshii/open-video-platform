## Later: Cache Docker layers in the smoke test

Needs: [Task-08 — Add the preview smoke test workflow](Task-08-Add-the-preview-smoke-test-workflow.md)

Keep Docker build layers in the GitHub Actions cache with Buildx, so services that didn't change aren't rebuilt on every
run. From [ci-with-github-actions.md](../../../../explainers/ci-with-github-actions.md), Part 7.
