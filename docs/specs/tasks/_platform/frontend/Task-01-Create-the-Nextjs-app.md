## Create the Next.js app

Create the UI in `apps/ui`: Next.js with the App Router, TypeScript, Tailwind and shadcn/ui, laid out like the
reference app in `docs/_internal/chift-test-develop/apps/ui/web`.

* `features/<context>/` with `domain`, `application`, `infrastructure` and `presentation`; shared pieces in
  `components/` and `lib/`.
* TanStack Query for server data, TanStack Form for forms, axios, sonner for toasts — with their providers in the root
  layout.
* `output: "standalone"` for the Docker image, and `transpilePackages` for `@ovp-lib/common`, so the error codes and the
  languages come from the same code the APIs use.
* Biome, like the rest of the repository, instead of ESLint and Prettier.

Why: page data is fetched in the browser only, and the server renders the shell from cookies — language, theme, sidebar
state, current channel. The token refresh then lives in one place, the browser API client, since a server component
can't set the new cookies a refresh returns.
