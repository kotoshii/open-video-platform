## Spike: Choose the i18n library

Compare the i18n libraries that work with the Next.js App Router as it stands now. next-intl, i18next with
react-i18next, Lingui and FormatJS are the usual candidates, but check their current state rather than the list. What
decides it:

* server and client components both render translated text;
* the language switches at runtime, with no page reload;
* plural rules and interpolated values;
* the language can be read from a cookie, so a server-rendered page comes out right on the first paint.

Write the choice and the reason for it into
[US-I18n-01](../../../../user-stories/i18n/US-I18n-01-Language-selector.md)'s tech notes.

Why: the last two are what rule a library out here, and both are easy to miss in a quick comparison.
