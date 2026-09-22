## Send users here when no channel is chosen

Needs: [Task-01 — Build the channel selection page](Task-01-Build-the-channel-selection-page.md),
[US-Channels-02 Task-01 — Store the current channel and send it with requests](../../US-Channels-02/frontend/Task-01-Store-the-current-channel-and-send-it-with-requests.md)

Route every case where the app has no channel to act as to this page:

* after logging in, when the account has more than one channel — with exactly one, that channel becomes current and the
  homepage opens instead ([US-Auth-01](../../../../user-stories/auth/US-Auth-01-Account-creation-and-login.md));
* when the stored channel is gone and the gateway rejects it;
* after the channel being acted as is deleted
  ([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md));
* on any request for a page inside the layout while no channel is stored.

Why: the check sits next to the session check in the middleware
([US-Auth-04](../../../../user-stories/auth/US-Auth-04-Session-persistence.md)), so no page has to work out for itself
whether it can render.
