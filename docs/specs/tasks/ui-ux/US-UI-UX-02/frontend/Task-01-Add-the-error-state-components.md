## Add the error state components

Needs: [_platform frontend Task-01 — Create the Next.js app](../../../_platform/frontend/Task-01-Create-the-Nextjs-app.md),
[US-I18n-01 Task-02 — Set up the i18n library](../../../i18n/US-I18n-01/frontend/Task-02-Set-up-the-i18n-library.md)

Build the two error states the whole app uses: one with a "Try again" action, and one that asks the user to reload the
page. Each renders as a full page, in place of the content, or inside a section, in place of that block.

Add with them the single function that turns an error into a message. It ships returning the generic message;
[US-I18n-02](../../../../user-stories/i18n/US-I18n-02-Localized-error-messages.md) fills in the mapping from error
codes, the English fallback, and the messages for failures that never reached the API.

Why: every failure — a page, a section, a toast — then takes its text from one function, so localising them later is one
piece of work rather than a sweep through the app.
