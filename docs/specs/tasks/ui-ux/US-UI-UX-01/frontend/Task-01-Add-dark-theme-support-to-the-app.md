## Add dark theme support to the app

Needs: [_platform frontend Task-01 — Create the Next.js app](../../../_platform/frontend/Task-01-Create-the-Nextjs-app.md)

Set up light and dark themes for the whole app with `next-themes`, which shadcn/ui is built around: its provider in the
root layout, the theme as a class on `<html>`, and the system preference as the starting point.

* Define the light and dark colour tokens once, in the global stylesheet, so no component checks the theme itself.
* The chosen theme is kept in the browser and restored on the next visit.
* Keep the inline script `next-themes` injects, and set `suppressHydrationWarning` on `<html>`.

Why: that script sets the class before the first paint, which is what stops the page appearing in the wrong theme for a
moment. React otherwise complains that the server's markup and the browser's differ — because the script changed it on
purpose.
