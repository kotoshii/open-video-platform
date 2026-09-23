## Define the supported languages in lib

Add the list of supported languages to `lib/common`: English (`en`, the default) and Ukrainian (`uk`), each with its own
name — "English" and "Українська" — and a check that tells whether a value is one of them.

The language selector, sign-up, the email language setting and the email worker all use this one list
([US-I18n-01](../../../user-stories/i18n/US-I18n-01-Language-selector.md),
[US-I18n-03](../../../user-stories/i18n/US-I18n-03-Localized-emails.md)).

Why: a stored language decides which email template is used, so every value is checked against this list. Sign-up
turns anything else into English; the email language setting rejects it.
