## Add a mail catcher to Compose

Needs: [Task-23 — Create email-worker](Task-23-Create-email-worker.md)

Add a local mail catcher such as Mailpit to `infra.yaml`, and point the email worker's SMTP settings at it in preview
and development.

Why: development mail shows up in a browser instead of being sent or silently dropped. It is separate from any mail
catcher the observability stack uses for alerts, which bypasses the platform on purpose
([observability-plan.md](../../../observability-plan.md), Phase 6).
