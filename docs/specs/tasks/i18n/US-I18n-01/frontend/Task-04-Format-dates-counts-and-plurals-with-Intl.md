## Format dates, counts and plurals with Intl

Needs: [Task-02 — Set up the i18n library](Task-02-Set-up-the-i18n-library.md)

Add the shared formatting helpers every feature uses, built on the platform's `Intl` APIs and taking the current
language:

* relative dates — "5 months ago" — with `Intl.RelativeTimeFormat`;
* abbreviated counts — "1.3M" — with `Intl.NumberFormat` and its compact notation;
* plural forms with `Intl.PluralRules`, so a message picks the right form for its number.

Why: Ukrainian has more plural forms than English, so "1 person has" and "47 people have" cannot be built from a
singular-or-plural switch. Timestamps are stored absolute and rendered relative, so this helper ends up on every list in
the app.
