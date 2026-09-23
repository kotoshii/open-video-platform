## Implement the create channel modal

Needs: [Task-03 — channel-api: Implement POST /channels](../backend/Task-03-channel-api-Implement-POST-channels.md),
[Task-04 — Build the channel block and switcher](Task-04-Build-the-channel-block-and-switcher.md)

Build the modal behind "Create new channel", on desktop and mobile alike: channel name, required, and description,
optional. The channel selection page opens the same modal
([US-Channels-07](../../../../user-stories/channels/US-Channels-07-channel-selection-page.md)), and the avatar field
joins it in [US-Channels-05](../../../../user-stories/channels/US-Channels-05-upload-user-pic.md).

Main flow:

1. User fills the form and clicks "Create".
2. A success toast appears, the app refreshes its tokens so the new channel is in the claim, stores it as the current
   channel, and reloads.

Branch — the name is empty:

1. A field error, and nothing is sent.

Branch — the request fails:

1. The toast behaviour applies and the modal stays open with what was typed.

Why: creating is the one case that needs new tokens, so it reloads the page — switching does not, because no token
changes ([US-Channels-02](../../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md)).
