## Turn error codes into localized messages

Needs: [US-I18n-01 Task-02 — Set up the i18n library](../../US-I18n-01/frontend/Task-02-Set-up-the-i18n-library.md),
[US-UI-UX-02 Task-01 — Add the error state components](../../../ui-ux/US-UI-UX-02/frontend/Task-01-Add-the-error-state-components.md)

Fill in the message function the error states and the toasts already call: it takes an error and returns the message for
the current language.

* Every code from the shared list has a message in both catalogues, and a missing translation falls back to English.
* A code the app does not know gets the generic message.
* A failure with no response at all — a dropped connection, a timeout, a gateway error — is mapped by kind, from the
  HTTP status or the network error.
* Values from the response's `details` are interpolated into the message, so the server never puts a sentence together.

Success messages are keyed by the action the user took, not by anything the server sends.

Add the check that every code has a translation in every language: the codes are a union type, so a record typed by that
union fails to compile as soon as one is missing.

Why: stories keep adding codes, and the compile-time check is the only thing that keeps the catalogues in step with them.
