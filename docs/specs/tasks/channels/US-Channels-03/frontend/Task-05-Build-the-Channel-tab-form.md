## Build the Channel tab form

Needs: [Task-02 — channel-api: Implement PUT /channels/current](../backend/Task-02-channel-api-Implement-PUT-channels-current.md),
[Task-04 — Build the settings page with its tabs](Task-04-Build-the-settings-page-with-its-tabs.md)

Build the form on the Channel tab: channel name, description and the "Show age-restricted content" toggle, saved
together with one Save. The avatar joins them in
[US-Channels-05](../../../../user-stories/channels/US-Channels-05-upload-user-pic.md).

Main flow:

1. The tab loads the current channel.
2. User edits and clicks Save; a success toast confirms it.
3. Everything on the page showing those values updates at once, the sidebar's channel block included.

Branch — the name is empty:

1. A field error, and nothing is sent.

Branch — the account is too young for age-restricted content:

1. The toggle is not rendered, and that content stays hidden anyway.

Branch — saving fails:

1. The toast behaviour applies and the entered values stay in the form.

Why: the toggle is a preference over a flag that already exists on the video — the date of birth decides whether a
viewer *may* see that content, and this decides whether they *want* to, which is why someone too young never sees it.
