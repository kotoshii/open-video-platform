## US-I18n-03 — Localized emails

**Description**

As any user, I want the emails the platform sends me to be in a language I choose, so that I understand them as easily
as the app itself.

The email language is an account setting of its own, separate from the interface language
([US-I18n-01](./US-I18n-01-Language-selector.md)). The interface language lives only in the browser, while every email
goes to the account's inbox — so the language of emails belongs to the account, and every email the platform sends
uses it.

**User flows**

Choose the email language — main flow:

1. User opens the settings page on the Account tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the email language setting, showing the current language.
3. User picks another language and saves.
4. A success toast confirms the change, and every email sent from then on uses the new language.

Set at sign-up:

1. User signs up while the interface is in some language
   ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)).
2. The sign-up request includes that language.
3. It becomes the account's email language, so even the confirmation email
   ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)) arrives in it.

Receive an email:

1. Something sends the user an email — account confirmation, password reset, email change, channel or account deletion,
   or a reply or mention notification.
2. The email, subject line included, is written in the account's email language.

Branches:

* **No language sent at sign-up, or an unsupported one** — the email language is set to English.
* **The interface language is changed in the sidebar** — the email language stays as it is, and an info toast says that
  the language of emails is set separately, in the settings ([US-I18n-01](./US-I18n-01-Language-selector.md)).
* **Saving fails** — the default toast behaviour applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)) and the stored language stays unchanged.

**Acceptance criteria**

* The Account tab of the settings page has an email language setting that offers every supported language.
* The setting belongs to the account, not to a channel: all channels of an account share it, just as they share one
  inbox.
* Every email the platform sends, subject line included, is written in the account's email language — account
  confirmation, password reset, email change, deletion emails and notifications alike.
* Sign-up sets the email language to the interface language in use at that moment; with none, or an unsupported one,
  it is English.
* Changing the interface language does not change the email language.
* A saved change applies to every email sent after it.
* A template without a translation for the chosen language falls back to English.
* Dates and counts in an email follow the email's language.
* Content written by users — a comment preview, a channel name — appears in the email exactly as written.

**Tech notes**

* The email language is stored with the account and read when an email is written. No request's language is used
  anywhere — not for emails the user triggers, and not for notifications, where the request that caused the email
  belongs to whoever replied or mentioned rather than to the recipient.
* This keeps the interface language exactly as [US-I18n-01](./US-I18n-01-Language-selector.md) decided: client-only,
  never stored on the server. The two are separate settings with separate owners — the browser owns the interface
  language, the account owns the email language.
* The email worker looks up both values when it sends: the address from `auth-api`, since only Keycloak stores it, and
  the language from `account-api`, which owns this setting ([service-map.md](../../service-map.md)). Looking them up at
  send time means an email that waits in the notification batching window
  ([US-Notifications-03](../notifications/US-Notifications-03-Email-channel.md)) goes to the current address, in the
  language current when it is actually sent.
* The sign-up request carries the selected interface language as a plain field in its body. Like every stored value it
  is validated against the supported languages, defined once in `lib/` and shared with the language selector; anything
  else becomes English. The value decides which template is used, so it is never used unchecked.
* Choose one way to organise templates — one Handlebars template per language, or one template per email with
  translated strings — and localize the subject line with it. The escaping rule for user content from
  [US-Notifications-03](../notifications/US-Notifications-03-Email-channel.md) applies to every language version.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Auth-02 — Account confirmation](../auth/US-Auth-02-Account-confirmation.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-I18n-01 — Language selector](./US-I18n-01-Language-selector.md)
* [US-Notifications-03 — Email notifications](../notifications/US-Notifications-03-Email-channel.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
