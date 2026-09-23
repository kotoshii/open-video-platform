## Add the avatar upload to the Channel tab

Needs: [Task-01 — channel-api: Implement PUT /channels/current/avatar](../backend/Task-01-channel-api-Implement-PUT-channels-current-avatar.md),
[US-Channels-03 Task-05 — Build the Channel tab form](../../US-Channels-03/frontend/Task-05-Build-the-Channel-tab-form.md)

Add the picture to the Channel tab: the current one, with a drop area saying "Drop a file here" on desktop and an
"Upload" button on mobile.

Main flow:

1. User drops or picks a file; its size and type are checked before anything leaves the browser.
2. Save uploads the picture, then saves the rest of the tab.
3. Every avatar on the page shows the new picture at once.

Branch — the file is too large or unsupported:

1. A readable error, and nothing is uploaded.

Branch — the upload fails:

1. The toast behaviour applies, the previous picture stays, and the rest of the tab is not saved either.

Why: avatars rendered from data other services own — on comments, on videos — may show the old picture for a while,
which is expected rather than a bug.
