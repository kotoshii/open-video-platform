## Switch to the channel a settings link names

Needs: [US-Channels-02 Task-02 — Switch the current channel from the switcher](../../../channels/US-Channels-02/frontend/Task-02-Switch-the-current-channel-from-the-switcher.md),
[US-Channels-03 Task-04 — Build the settings page with its tabs](../../../channels/US-Channels-03/frontend/Task-04-Build-the-settings-page-with-its-tabs.md)

When the settings page opens with a channel id in its address, make that channel the current one before the tab loads,
then drop the id from the address.

Branch — the id is one of the account's channels:

1. Switch to it the same way the switcher does, so the sidebar's channel block shows it.

Branch — it is not:

1. Ignore it and open the current channel's settings.

Why: the current channel lives on the client, not in the address or the token, so a link from an email can only name
the channel and let the app do the switch. Whether the channel is the account's own is answered by the token's
`channelIds` claim, with no request.
