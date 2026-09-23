## Build the channel selection page

Needs: [US-Channels-01 Task-04 — Build the channel block and switcher](../../US-Channels-01/frontend/Task-04-Build-the-channel-block-and-switcher.md),
[US-Channels-01 Task-05 — Implement the create channel modal](../../US-Channels-01/frontend/Task-05-Implement-the-create-channel-modal.md)

Build the page in the route group without the layout, listing every channel of the account with its avatar and name, and
"Create new channel" at the bottom. It shows the language selector and the theme toggle in the top right corner, like
the auth pages.

Main flow:

1. User clicks a channel; it becomes the current one and the homepage opens — or the page the user was on its way to
   before logging in, when the address carries one.
2. Creating one here makes the new channel current and continues to the homepage the same way.

Why: this is the one screen where somebody is signed in but has no channel to act as, so the sidebar's channel block and
the notifications badge would have nothing to render — which is why it sits outside the layout.
