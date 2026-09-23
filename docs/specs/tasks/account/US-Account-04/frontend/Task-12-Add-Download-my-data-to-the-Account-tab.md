## Add Download my data to the Account tab

Needs: [Task-11 — account-api: Implement POST /accounts/current/export](../backend/Task-11-account-api-Implement-POST-accounts-current-export.md),
[US-Channels-03 Task-04 — Build the settings page with its tabs](../../../channels/US-Channels-03/frontend/Task-04-Build-the-settings-page-with-its-tabs.md)

Add the "Download my data" section to the Account tab. It says what the archive contains, that it covers every channel
of the account, that video files are not in it, that one export per hour is allowed, and when the last export was made
— or that there has not been one yet. Below that, a password input and "Download".

Main flow:

1. "Download" sends the password; the URL in the response opens in a new tab, where the archive downloads.

Branch — the password is wrong:

1. A field-level error.

Branch — the export fails:

1. The default toast behaviour.

Branch — the browser blocks the new tab:

1. Show a visible "Download" link to the same URL in the section.

Why: the tab is opened from the response rather than straight from the click, and that is exactly where popup blockers
step in — check it in a real browser before relying on it.
