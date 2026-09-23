## email-worker: Add the reply and mention templates

Needs: [_platform infrastructure Task-25 — Render emails from Handlebars templates](../../../_platform/infrastructure/Task-25-Render-emails-from-Handlebars-templates.md)

Add two templates to `email-worker`, in English and Ukrainian: the first email, about one reply or mention, and the
follow-up that gathers several.

* Name the channel the email concerns — every channel of an account shares one inbox.
* For each reply or mention: who wrote it, and the text cut after 200 characters.
* Link each one to the video page with `?comment=<id>`, and the footer to the settings page with that channel's id, so
  it opens that channel's notification preferences.
* Render the names and the text only with `{{ }}`.

Why: the preview is 200 characters, the notification center's limit — not the comments section's 400, which belongs to a
different place.
