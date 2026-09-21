## US-I18n-01 — Language selector

**Description**

As any user, I want to choose the language the app's interface is shown in, so that I can use the platform in a
language I'm comfortable with.

The language covers the interface and the error and success messages — nothing else. Emails have a language setting
of their own ([US-I18n-03](./US-I18n-03-Localized-emails.md)).
It does not change what content is shown, and it has nothing to do with the feed or recommendations.

**User flows**

Change the language — main flow:

1. User finds the language selector in the sidebar, directly above the theme toggle
   ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
2. On desktop it is a button with a language icon and the current language's name; on mobile it is just the icon.
3. User clicks it, and a modal opens in the middle of the screen listing every available language.
4. The modal says that changing the language does not reload the page, so it is safe at any moment — even in the middle
   of an upload.
5. User picks a language.
6. The modal closes and the whole interface switches to that language straight away, without a reload.
7. From then on, error and success messages appear in that language too
   ([US-I18n-02](./US-I18n-02-Localized-error-messages.md)).
8. An info toast says that the language of emails is not affected and can be changed in the settings
   ([US-I18n-03](./US-I18n-03-Localized-emails.md)).

Change the language — branches:

* **Pages without the sidebar** (step 1) — the auth pages show the language selector in the top right corner, next to
  the theme toggle ([US-UI-UX-01](../ui-ux/US-UI-UX-01-Dark-theme-support.md)), and it works the same way.
* **Closing the modal without choosing** (step 5) — nothing changes.
* **Coming back later** — the app opens in the language chosen last time in this browser.

**Acceptance criteria**

* The language selector is in the sidebar, directly above the theme toggle.
* On desktop it shows a language icon and the current language's name; in the collapsed sidebar and on mobile, only the
  icon.
* On pages without the sidebar it sits in the top right corner, next to the theme toggle.
* Clicking it opens a modal in the middle of the screen with every available language, on desktop and on mobile alike.
* Languages are listed by their own names — "Deutsch", not "German" — so anyone can find theirs whatever language the
  interface is currently in.
* The modal states that changing the language does not reload the page or interrupt anything in progress.
* Picking a language closes the modal and switches the interface immediately, without reloading the page; an upload in
  progress keeps going.
* Error and success messages appear in the selected language.
* Relative dates, abbreviated counts and plural forms follow the selected language — "5 months ago", "1.3M",
  "1 person" and "47 people".
* Content written by users — video titles, descriptions, comments, channel names — is shown exactly as written and is
  never translated.
* English is the default language.
* After the language is changed, an info toast says that the language of emails is not affected and can be changed in
  the settings. On pages without the sidebar, where nobody is signed in, the toast is not shown.
* The choice is remembered in the browser and applies on the next visit. It is not stored on the server and does not
  follow the account to other devices.

**Tech notes**

* Pick the i18n library before building. The options have moved on since this was last looked at, so compare what
  currently works well with the Next.js App Router across server and client components, switches language at runtime
  without a reload, and handles plural rules and interpolated values. next-intl, i18next with react-i18next, Lingui and
  FormatJS are the usual candidates — check their current state rather than trusting this list.
* The setting lives only on the client, as decided. Keep it in a **cookie** rather than in localStorage: a cookie is
  still client-side storage, but the Next.js server can read it, so server-rendered pages come out in the right language
  from the first paint. With localStorage alone every page renders in English and then switches — the same flash
  problem as the theme ([US-UI-UX-01](../ui-ux/US-UI-UX-01-Dark-theme-support.md)) and the sidebar state
  ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
* Switching without a reload means every component has to read its strings from the current language. Nothing may be
  translated once and then kept as finished text — in a store, a query cache or component state — or it stays in the old
  language after the switch.
* Format dates, numbers and plurals with the platform's `Intl` APIs — `Intl.RelativeTimeFormat`, `Intl.NumberFormat`
  with compact notation, `Intl.PluralRules` — rather than by hand. Plural rules genuinely differ between languages, and
  some have three or more forms, so text like "1 person has" and "47 people have" cannot be built from a simple
  singular-or-plural switch.
* The interface language never reaches emails: they use a separate account setting
  ([US-I18n-03](./US-I18n-03-Localized-emails.md)), which is why changing the language here shows a toast pointing
  to it.
* The app ships with **English and Ukrainian** (listed as "English" and "Українська"). Ukrainian has more plural forms
  than English, so shipping it from the start exercises the plural handling above instead of leaving it untested until a
  third language arrives.

**Links**

* [US-I18n-02 — Localized error messages](./US-I18n-02-Localized-error-messages.md)
* [US-I18n-03 — Localized emails](./US-I18n-03-Localized-emails.md)
* [US-Notifications-03 — Email notifications](../notifications/US-Notifications-03-Email-channel.md)
* [US-UI-UX-01 — Dark theme support](../ui-ux/US-UI-UX-01-Dark-theme-support.md)
* [US-UI-UX-03 — Global layout](../ui-ux/US-UI-UX-03-Global-layout.md)

**Tasks**

FE:

* TODO
