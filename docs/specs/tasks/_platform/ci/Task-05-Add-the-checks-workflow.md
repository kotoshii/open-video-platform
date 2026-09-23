## Add the checks workflow

Needs: [Task-01 — Pin the Node version](Task-01-Pin-the-Node-version.md),
[Task-03 — Set up Jest for the Nest apps](Task-03-Set-up-Jest-for-the-Nest-apps.md),
[Task-04 — Set up Vitest for the UI](Task-04-Set-up-Vitest-for-the-UI.md)

Add `.github/workflows/checks.yml`: on every push, `yarn install --immutable`, then lint, typecheck and tests. Cancel a
running check when a newer push lands on the same branch, and cap the job with `timeout-minutes`. The workflow is
written out in [ci-with-github-actions.md](../../../../explainers/ci-with-github-actions.md), Part 5.

Why: `--immutable` fails when `yarn.lock` would change, which catches a dependency added without its lockfile.
