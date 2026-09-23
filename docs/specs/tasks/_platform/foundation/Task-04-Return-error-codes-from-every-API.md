## Return error codes from every API

Needs: [Task-03 — Define the API error codes in lib](Task-03-Define-the-API-error-codes-in-lib.md)

Add a global exception filter to `lib/api` that turns every error into the response shape from Task-03, and use it in
the app builder's defaults in place of `InternalServerErrorFilter`.

* Domain errors carry their code; the filter maps them to a status.
* Validation pipe errors become one `validation_failed` response with an entry per invalid field — its name, its code
  (`required`, `too_long`, ...) and details such as the limit.
* Errors coming back from a gRPC call keep their code: send it in the gRPC status details and map it back with the
  existing gRPC-to-HTTP status table.
* Anything unexpected is logged and returned as `internal_error`, with no message text and no stack trace.

Why: a response that carries only a code and values can be shown in any language, because the sentence is put together
on the client ([US-UI-UX-02](../../../user-stories/ui-ux/US-UI-UX-02-User-friendly-errors.md)).
