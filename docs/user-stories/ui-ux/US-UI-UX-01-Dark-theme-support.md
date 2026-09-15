## US-UI-UX-01 — Dark theme support

**Description**

As any user, I want to switch the app between light and dark themes, so that I can browse comfortably in any lighting
and keep the look I prefer.

**Tech notes**

* shadcn/ui ships with built-in dark mode support — check it before writing anything custom.
* Default theme follows the system preference.
* The selected theme is stored on the client and restored on the next visit.

**Acceptance criteria**

* The theme toggle is in the sidebar, directly below the language selector, on every page that has the sidebar
  ([US-UI-UX-03](./US-UI-UX-03-Global-layout.md)) — in both the expanded and the collapsed sidebar on desktop, and in
  the sidebar drawer on mobile.
* Auth pages have no sidebar and therefore no theme toggle; they use the theme chosen earlier, or the system
  preference.
* On first visit the app uses the system preferred theme.
* The chosen theme persists between visits and page reloads.
* The theme applies consistently across all pages and switches smoothly, on both desktop and mobile.
* No flash of the wrong theme on page load.

**Tasks**

FE:

* TODO