## Add lint, typecheck and test scripts

Add root scripts: `lint` running `biome ci .`, `typecheck` running `yarn workspaces foreach -At run typecheck`, and
`test` running `yarn workspaces foreach -A run test`. Give every workspace a `typecheck` script (`tsc --noEmit`).

Why: `-t` checks `proto` and `lib` before the apps that import them, and Yarn only runs `test` in workspaces that define
it, so workspaces without tests are skipped instead of failing
([ci-with-github-actions.md](../../../../explainers/ci-with-github-actions.md), Part 4).
