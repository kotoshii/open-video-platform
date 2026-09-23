## Define the API error codes in lib

Create the list of error codes in `lib/common`, which both the APIs and the UI import, together with the shape of an
error response:

* the HTTP status and the `code`;
* `details` — the values the message needs, such as a maximum size or a remaining cooldown;
* `fields` — for validation errors, one entry per field, each with its own `code` and `details`.

Start with the generic codes — validation failed, unauthorized, forbidden, not found, internal error — and let each
story add its own codes as it is built. Codes are identifiers such as `video_not_found`, never sentences
([US-I18n-02](../../../user-stories/i18n/US-I18n-02-Localized-error-messages.md)).

Why: with one list shared by both sides, the server can't send a code the client has never heard of, and the UI can
check at compile time that every code has a translation in every language.
