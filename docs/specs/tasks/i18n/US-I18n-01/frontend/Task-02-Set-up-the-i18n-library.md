## Set up the i18n library

Needs: [Task-01 — Spike: Choose the i18n library](Task-01-Spike-Choose-the-i18n-library.md),
[_platform frontend Task-01 — Create the Next.js app](../../../_platform/frontend/Task-01-Create-the-Nextjs-app.md)

Set up the library the Spike chose, with an English and a Ukrainian catalogue and English as the default. Every string
in the app comes from a catalogue from here on, and each task adds its own strings to both.

* The language comes from a cookie, read on the server, so a page renders in the right language from the first paint.
* Picking a language writes the cookie and switches the interface without a reload.
* Components read their strings from the current language on every render. Nothing is translated once and then kept as
  finished text — not in a store, not in the query cache, not in component state.

Why: text kept anywhere after it has been translated is what leaves half the page in the old language after a switch.
