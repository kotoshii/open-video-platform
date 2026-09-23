## Add the avatar to the create channel modal

Needs: [Task-02 — Add the avatar upload to the Channel tab](Task-02-Add-the-avatar-upload-to-the-Channel-tab.md),
[US-Channels-01 Task-05 — Implement the create channel modal](../../US-Channels-01/frontend/Task-05-Implement-the-create-channel-modal.md)

Add the optional picture to the creation form, with the same drop area and the same checks as the Channel tab. The
channel is created first; once the tokens are refreshed and it is the current channel, its picture is uploaded, and
then the page reloads.

Branch — the upload fails after the channel was created:

1. The channel stays and the toast says the picture was not saved; the user can add it from the settings.

Why: two requests means the modal has to say which half failed, rather than looking as though nothing happened. The
upload has to wait for the refresh: the avatar endpoint acts on the current channel, and the gateway refuses a channel
the token does not list yet.
