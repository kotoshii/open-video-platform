## Catch client-side exceptions with error boundaries

Needs: [Task-01 — Add the error state components](Task-01-Add-the-error-state-components.md),
[_platform frontend Task-02 — Set up the route groups](../../../_platform/frontend/Task-02-Set-up-the-route-groups.md)

Wrap the app in a top-level error boundary, and give a section that loads its own data a boundary of its own. In
Next.js these are `error.tsx` in each route group and `global-error.tsx` at the root.

Main flow:

1. A component throws while rendering.
2. The nearest boundary catches it.
3. That part of the page is replaced by the error state asking for a reload, and the rest keeps working.

Branch — nothing below the root catches it:

1. The top-level boundary shows the same error state as a whole page.

Why: without a boundary an unhandled exception leaves a blank page, which reads as "the app is broken" rather than "this
part failed".
