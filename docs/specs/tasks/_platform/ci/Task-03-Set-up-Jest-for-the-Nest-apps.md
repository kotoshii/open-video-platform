## Set up Jest for the Nest apps

Needs: [Task-02 — Add lint, typecheck and test scripts](Task-02-Add-lint-typecheck-and-test-scripts.md)

Set up Jest — the runner Nest's CLI and docs use — for `lib` and the Nest APIs and workers: one shared base config that
each workspace extends, and a `test` script only in workspaces that have tests. Use a TypeScript transform that keeps
decorator metadata (`ts-jest` or `@swc/jest`), and map the workspace path aliases.

Why: Nest's dependency injection reads decorator metadata, so a transform that drops it fails tests in ways that look
like injection bugs.
