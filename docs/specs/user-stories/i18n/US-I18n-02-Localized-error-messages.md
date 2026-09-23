## US-I18n-02 — Localized error messages

**Description**

As any user, I want every message the app shows me — errors and successes alike — to be in the language I have chosen,
so that I always understand what happened.

This covers toasts as well as the text of full-page and section error states
([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)). The language itself is chosen in
[US-I18n-01](./US-I18n-01-Language-selector.md).

**User flows**

See a message — main flow:

1. User has picked a language, or is using the default one, English.
2. User does something that produces a message — posts a comment, uploads a video, opens a video that does not exist.
3. The server answers with a message code, never with text.
4. The app turns the code into a message in the selected language and shows it.

See a message — branches:

* **No translation for this code in the selected language** (step 4) — the English message is shown instead.
* **A code the app does not know** (step 4) — a generic message in the selected language is shown.
* **No answer from the server at all** (step 3) — a dropped connection, or a failure before the request reaches the
  API; the app shows a generic message in the selected language, chosen by the kind of failure.

**Acceptance criteria**

* Every toast and every error state appears in the selected language.
* The server never sends the text of a message — only a message code, plus any values the message needs.
* The app maps each code to a message in the selected language.
* A code without a translation in the selected language falls back to English.
* An unknown code, and a failure with no response at all, show a generic message in the selected language.
* Nothing technical reaches the user: no raw codes, exception text or stack traces.
* Field-level validation errors are localized too, and still appear under the field they belong to. A field error for
  a field the form does not show appears as a toast instead, so no message is lost.

**Tech notes**

* Codes are identifiers, not sentences — `video_not_found`, `comment_creation_failed` and the like. Those two are only
  examples, not a real list.
* When an API fails because another service it called failed, the response carries that service's code rather than a
  generic one, so the user sees what actually went wrong.
* When a message needs details, the response carries them as separate values next to the code — a maximum file size, a
  field name — and the sentence is put together on the client. Text formatted on the server would be in one language and
  impossible to translate.
* Field-level errors carry the name of the field alongside the code, so the form knows where to show them — for example
  the email already taken on sign-up ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)).
* Define the codes once, in the shared `lib/` code that both the API and the front end already import. Then the server
  cannot send a code the client has never heard of, and the client can check at compile time that every code has a
  translation in every language.
* Success messages often do not need a code from the server at all — the client already knows what it has just done —
  so they can be keyed by the action instead. The rule that matters is the same either way: no human-readable text comes
  from the server.
* Failures that never reach the API — the gateway, a dropped connection — come without a code, so the client maps them
  by kind, from the HTTP status or the network error, to generic localized messages.
* Emails are localized separately ([US-I18n-03](./US-I18n-03-Localized-emails.md)).

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-I18n-01 — Language selector](./US-I18n-01-Language-selector.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* [_platform foundation Task-03 — Define the API error codes in lib](../../tasks/_platform/foundation/Task-03-Define-the-API-error-codes-in-lib.md)
* [_platform foundation Task-04 — Return error codes from every API](../../tasks/_platform/foundation/Task-04-Return-error-codes-from-every-API.md)

FE:

* [Task-01 — Turn error codes into localized messages](../../tasks/i18n/US-I18n-02/frontend/Task-01-Turn-error-codes-into-localized-messages.md)
* [Task-02 — Show field-level errors under their fields](../../tasks/i18n/US-I18n-02/frontend/Task-02-Show-field-level-errors-under-their-fields.md)
