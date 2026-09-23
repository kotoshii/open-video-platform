## Send a deleted account to the sign-up page

Needs: [Task-09 — auth-api: Tell a deleted account apart on refresh](../backend/Task-09-auth-api-Tell-a-deleted-account-apart-on-refresh.md),
[_platform frontend Task-04 — Add single-flight token refresh to the API client](../../../_platform/frontend/Task-04-Add-single-flight-token-refresh-to-the-API-client.md)

When a refresh fails with the deleted-account code, send the user to the sign-up page instead of the login page, and
drop the stored current channel.

Why: the single-flight refresh is the one place a failed refresh is handled, so this is one more branch there rather
than a check on every page.
