## Show the unconfirmed email banner

Needs: [US-UI-UX-03 Task-01 — Build the app shell layout](../../../ui-ux/US-UI-UX-03/frontend/Task-01-Build-the-app-shell-layout.md),
[US-Auth-01 Task-09 — auth-api: Implement GET /auth/current-user](../../US-Auth-01/backend/Task-09-auth-api-Implement-GET-auth-current-user.md)

Show a banner at the top of every page inside the layout while the account's email is unconfirmed, saying so and
linking to the confirmation page.

Build the dismissal here, as the component the deletion banners reuse
([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md),
[US-Account-01](../../../../user-stories/account/US-Account-01-Delete-own-account.md)): closing a banner hides it for 24
hours, remembered in the browser rather than on the server.

Branch — the email is confirmed:

1. The banner is gone for good.

Why: 24 hours is what keeps a banner from being both ignorable and maddening — and it is remembered per browser because
it is a preference about a notice, not about the account.
