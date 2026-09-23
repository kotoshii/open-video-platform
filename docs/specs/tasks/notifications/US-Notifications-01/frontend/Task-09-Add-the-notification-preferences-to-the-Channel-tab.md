## Add the notification preferences to the Channel tab

Needs: [Task-04 — notification-api: Implement PUT /notifications/preferences](../backend/Task-04-notification-api-Implement-PUT-notifications-preferences.md),
[US-Channels-03 Task-05 — Build the Channel tab form](../../../channels/US-Channels-03/frontend/Task-05-Build-the-Channel-tab-form.md)

Add the section under the channel form: a table with a row per type — New subscribers, New comments on my videos,
Replies to my comments, Mentions — and an In-app and an Email column. Only replies and mentions have Email toggles. The
section has its own "Save".

Main flow:

1. The section loads the acting channel's preferences.
2. The user switches toggles and clicks "Save"; a success toast confirms it.

Branch — the account's email is not confirmed:

1. The Email toggles cannot be turned on, and the section says the email has to be confirmed first, with a link to the
   confirmation page ([US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md)).

Branch — saving fails:

1. The toast behaviour applies and the toggles keep the changes, so saving can be retried.

Branch — the user switches channel:

1. The section loads that channel's preferences.

Why: the section saves on its own because it is a different service's data from the form above it — the settings page
composes what each service offers rather than saving one form.
