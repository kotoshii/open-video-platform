## Build the settings page with its tabs

Needs: [US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md)

Build the page the sidebar's Settings item opens: a Channel tab and an Account tab, with Channel open by default and the
open tab in the address, so a link can point at either.

The tabs are filled by their own stories: the channel form (Task-05), the notification preferences
([US-Notifications-01](../../../../user-stories/notifications/US-Notifications-01-Notifications-config.md)) and
"Delete channel" ([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)) on one
side; the email ([US-Account-02](../../../../user-stories/account/US-Account-02-Change-email.md)), the password
([US-Account-03](../../../../user-stories/account/US-Account-03-Change-password.md)), the email language
([US-I18n-03](../../../../user-stories/i18n/US-I18n-03-Localized-emails.md)), the data export
([US-Account-04](../../../../user-stories/account/US-Account-04-Download-own-user-data.md)) and "Delete account" on the
other.

Why: the page has no endpoints of its own — it composes what each service already offers, which is why its sections
save separately rather than as one form.
