## Build the sidebar navigation

Needs: [Task-01 — Build the app shell layout](Task-01-Build-the-app-shell-layout.md),
[US-UI-UX-01 Task-02 — Build the theme toggle](../../US-UI-UX-01/frontend/Task-02-Build-the-theme-toggle.md),
[US-I18n-01 Task-02 — Set up the i18n library](../../../i18n/US-I18n-01/frontend/Task-02-Set-up-the-i18n-library.md)

Fill the sidebar. From the top: the logo, a slot for the current channel block
([US-Channels-02](../../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md)), a divider, then
the navigation — Homepage, Subscriptions, Notifications, Watch history, Rated videos, My comments, Settings — each an
icon with its name. The item for the current page is highlighted.

Pinned to the bottom, in this order: a slot for the language selector
([US-I18n-01](../../../../user-stories/i18n/US-I18n-01-Language-selector.md)), the theme toggle, a divider, and a slot
for "Log out" ([US-Auth-06](../../../../user-stories/auth/US-Auth-06-Logging-out.md)).

Every string goes through the i18n library.

Why: the items are plain links, so the list is defined here rather than grown by each page's story. Only the parts with
behaviour behind them — the channel block, the unread badge, logging out — come from their own stories.
