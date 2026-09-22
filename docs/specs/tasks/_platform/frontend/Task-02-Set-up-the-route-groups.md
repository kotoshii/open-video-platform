## Set up the route groups

Needs: [Task-01 — Create the Next.js app](Task-01-Create-the-Nextjs-app.md)

Split the pages into two route groups: `(app)`, with the navbar and the sidebar, and one without them for the auth
pages, the channel selection page and the pages opened from email links. Both layouts stay empty shells here — the
navbar and the sidebar come in [US-UI-UX-03](../../../user-stories/ui-ux/US-UI-UX-03-Global-layout.md).

Keep every page path in one constants file: emails, notifications and redirects all link to pages.

Why: a new page lands in one group or the other, so it can't forget the layout or show it by accident.
