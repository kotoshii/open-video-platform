## Show field-level errors under their fields

Needs: [Task-01 — Turn error codes into localized messages](Task-01-Turn-error-codes-into-localized-messages.md)

Map the `fields` entries of a validation error onto a form's fields, so each message appears under the input it belongs
to, in the selected language. Write it once as a helper the forms call with the error.

* Each entry's own code and details decide its message, so "too long" carries the limit it went over.
* A field name the form does not have falls back to the toast, so no message is lost.

Why: a field error that only appears in a toast leaves the user hunting for the field it is about — and the email
already taken on sign-up is exactly that case.
