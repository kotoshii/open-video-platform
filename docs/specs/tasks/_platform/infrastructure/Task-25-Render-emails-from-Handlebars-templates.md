## Render emails from Handlebars templates

Needs: [Task-24 — Look up the address and language when sending](Task-24-Look-up-the-address-and-language-when-sending.md),
[foundation Task-05 — Define the supported languages in lib](../foundation/Task-05-Define-the-supported-languages-in-lib.md)

Render every email, subject line included, from Handlebars templates that live inside the worker, in the account's email
language. Each story that sends an email adds its own template.

* Pick one way to organise the languages — a template per language, or one template with translated strings — and use
  it for the subject too.
* Fall back to English when a template has no translation in the chosen language.
* Format dates and counts for the email's language with `Intl`.
* Render user content — comment text, channel names — only with `{{ }}`, never `{{{ }}}`.

Why: `{{{ }}}` skips escaping, so a comment could put its own markup into the email
([US-Notifications-03](../../../user-stories/notifications/US-Notifications-03-Email-channel.md)).
