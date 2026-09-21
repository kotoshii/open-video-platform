## US-Channels-06 — Delete own channel

**Description**

As a registered user with a verified account and more than one channel, I want to schedule a channel I no longer need
for deletion and keep a week to change my mind, so that it and everything it published disappear from the platform
without a single click making that irreversible.

Nothing is deleted during that week. The channel's videos become private, but every record and every file stays where
it is, and the user can keep acting as the channel. Deletion happens once, at the end of the window, and it is final.

**User flows**

Request the deletion — main flow:

1. User opens the settings page on the Channel tab ([US-Channels-03](./US-Channels-03-current-channel-settings.md)).
2. User sees the "Delete channel" button, styled as destructive (red).
3. On click, a confirmation modal appears with text spelling out the consequences. Buttons: "Cancel" (primary, left)
   and "Yes" (secondary, right).
4. The "Yes" button stays disabled for 10 seconds to prevent accidental clicks, with the countdown shown in the button
   itself.
5. After pressing "Yes", the user receives an email with a confirmation link.
6. The email warns about the consequences once again.
7. Opening the link takes the user to a dedicated page in the app.
8. The link is validated (it lives for 5 minutes).
9. If valid, the deletion is scheduled for a week later, and the page states the date and time it will happen. The
   channel remains the one the user is acting as until it is deleted.
10. The user receives a second email confirming the date and carrying a link to cancel the deletion.

During the week:

1. Every video of the channel becomes private: nobody but the author can watch it, and it is gone from search, from
   feeds and from the channel page for visitors. The rows and the files are untouched.
2. Everything else about the channel stays live — the channel page itself, its comments and replies, its subscriptions
   in both directions and its subscriber count.
3. The user can keep acting as it — uploading, commenting, subscribing, rating — with nothing restricted. A video
   published during the window is private like the rest.
4. The Channel tab of the settings page states that the deletion is scheduled, for when, and offers "Cancel deletion".

Cancel the deletion:

1. User clicks "Cancel deletion" in the settings page, or opens the cancel link from the second email.
2. The schedule is cleared and a notification confirms it.
3. Every video returns to the visibility it had before, and nothing else changes, because nothing had been deleted.

Branches:

* **Email not confirmed** (step 2) — the button is unavailable, with a note that the account's email has to be
  confirmed first and a link to the confirmation page ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)).
* **User cancels the confirmation** (step 3) — the modal closes and nothing happens.
* **Expired or invalid link** (step 8) — the page explains what happened. There is deliberately no "resend" button, so
  channel deletion is not encouraged.
* **This is the last channel that is not already scheduled for deletion** (step 2) — the action is unavailable, and
  the tab explains that the last channel goes with the account instead
  ([US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* **The window passes** (after step 10) — the channel and all its data are deleted permanently, with no way to
  restore.
* **The user is acting as that channel when the window passes** — the channel is gone, so the app sends them to the
  channel selection page to pick another one
  ([US-Channels-07](./US-Channels-07-channel-selection-page.md)).

**Acceptance criteria**

Requesting:

* Deleting a channel requires a confirmed email. While it is unconfirmed, the button is unavailable and says why
  ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)).
* Only an account with more than one channel that is not already scheduled for deletion can schedule one; the last
  remaining channel goes with the account itself
  ([US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* The "Delete channel" button is in the Channel tab of the settings page and is styled as destructive.
* Deleting requires a confirmation modal that states the consequences, with the confirm button disabled for 10 seconds
  and a visible countdown.
* Confirming in the modal schedules nothing yet — it only sends the confirmation email.
* The confirmation link is valid for 5 minutes and works once.
* An expired or invalid link shows a clear message and offers no way to resend it.
* Opening a valid link schedules the deletion for one week later and states the date and time.
* A second email confirms that date and carries a link to cancel the deletion, valid until the deletion happens.
* Requesting a deletion never logs the user out of the account.

During the window:

* **Nothing is deleted before the window ends** — not a database row, not a file in storage.
* Every video of the channel becomes private as soon as the deletion is scheduled, so no one but the author can watch
  it, and it is absent from search, feeds and the channel page for visitors.
* A video published while the deletion is scheduled is private as well.
* Everything else about the channel stays live and visible: its page, its comments and replies, its subscriptions in
  both directions and its subscriber count.
* Counts still agree with what they count: the channel's video count follows what the viewer can see
  ([US-Channels-04](./US-Channels-04-see-own-and-other-channels.md)), while comment totals and subscriber counts are
  untouched, since none of that content was hidden.
* The user can keep acting as the channel with no restrictions: uploading, publishing, commenting, subscribing and
  rating all work as usual.
* The Channel tab states that a deletion is scheduled, when it will happen, and offers "Cancel deletion".
* A banner at the top of every page states the same while the user acts as that channel, and can be dismissed for 24
  hours at a time ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
* Cancelling from the settings page or from the email link clears the schedule and returns every video to the
  visibility it had before, leaving the channel exactly as it was.
* After cancelling, the channel can be scheduled for deletion again in the same way.

The deletion itself:

* Once the week has passed, the channel and all its data are removed permanently, with no way to restore.
* Everything the channel published disappears at that point — its videos, its comments and its subscriptions — and the
  counts on other channels' content adjust accordingly.
* If the user is acting as the channel when it is deleted, the app sends them to the channel selection page
  ([US-Channels-07](./US-Channels-07-channel-selection-page.md)).

**Tech notes**

The schedule:

* `deletion_scheduled_at` on the channel row is the source of truth. A BullMQ delayed job triggers the purge when the
  week is up, and a periodic sweep picks up rows whose job was lost — the same shape as the upload session expiry in
  [US-Videos-05](../videos/US-Videos-05-Upload-videos.md).
* The column exists rather than the job alone for three reasons: a week is a long time for the only record of a
  deletion to live in Redis, the settings page has to read the date on every load, and BullMQ's jobs already depend on
  that Redis running with `noeviction`.
* Cancelling removes the delayed job and clears the column. Nothing has to be put back, which is the whole point of
  the design.
* The "more than one channel" rule counts channels without a deletion scheduled, so an account can never end up with
  none.

Why the videos go private and nothing else changes:

* Hiding the videos uses `private`, a visibility value that already exists and that every read path already handles
  ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)). So **no service needs a "scheduled for deletion"
  notion of its own**, and no counter ends up disagreeing with a listing — the channel's video count is computed from
  what the viewer can see ([US-Channels-04](./US-Channels-04-see-own-and-other-channels.md)) and follows by itself.
* Store the visibility each video had before, so cancelling puts it back instead of leaving everything private.
* The comments, the subscriptions and the counts are deliberately left alone. Hiding them would mean every service
  holding a denormalized copy has to hide it too and then restore it on a cancel — which is the cost this design
  exists to avoid.
* Nothing is deleted before the purge, so a cancel has nothing to put back beyond the visibility flags.

The purge:

* The purge fans out over Kafka; every service deletes the data it owns and reports back, so this is a saga across
  services rather than a single transaction. Every step has to be idempotent, since a purge may be retried.
* What has to go, in full — this list is the contract between the services, and the one in
  [US-Account-01](../account/US-Account-01-Delete-own-account.md) is the same list applied to every channel of an
  account:
    * the channel's **videos** — rows, the whole S3 prefix (original, HLS, MP4 renditions, thumbnails), their search
      index documents and their Gorse items ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md));
    * the **comments and replies** it wrote, and the rates other channels gave those comments;
    * the **rates it gave** — on videos ([US-Videos-04](../videos/US-Videos-04-Like-dislike-videos.md)) and on comments
      ([US-Comments-06](../comments/US-Comments-06-Like-dislike-comments.md)) — each emitting a decrement so the counts
      on other channels' content come down instead of keeping a deleted channel's votes forever;
    * its **subscriptions in both directions**: the channels it followed and the channels that followed it. The
      outgoing ones emit unsubscribe events carrying the subscription's original creation time, which is what lets
      aggregated new-subscriber notifications count down correctly
      ([US-Subscriptions-01](../subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md),
      [US-Notifications-01](../notifications/US-Notifications-01-Notifications-config.md));
    * its **watch history** rows ([US-My-activity-01](../my-activity/US-My-activity-01-Watch-history.md));
    * the **notifications it received** and its **notification preferences**
      ([US-Notifications-01](../notifications/US-Notifications-01-Notifications-config.md));
    * its **Gorse user** and the feedback recorded against it
      ([US-Recommendations-01](../recommendations/US-Recommendations-01-Feed.md));
    * its **avatar object** in MinIO ([US-Channels-05](./US-Channels-05-upload-user-pic.md));
    * its **channel document** in the search index ([US-Search-02](../search/US-Search-02-Search-channels.md)).
* Logs aside, nothing of the channel is left afterwards.

Tokens and sessions:

* The emailed link is what authorises the deletion, so it only proves anything when the inbox is known to be the
  user's — hence the confirmed-email requirement. Check `email_verified` from the token on the server too; an
  unavailable button is not the enforcement.
* Both emails go through the custom email module, the same one used for account confirmation
  ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)).
* The confirmation token is single-use with a 5-minute lifetime and belongs server-side (Redis fits). The cancel token
  has to survive until the deletion happens, so it lives with the scheduled deletion rather than in a short-lived
  store.
* The `channelIds` claim goes stale when the purge runs, not when the deletion is requested — a week later, possibly
  while the user is signed in and acting as that channel. The gateway rejects the stale channel id and the app asks for
  a channel again, which [US-Channels-02](./US-Channels-02-freely-switch-between-channels.md) already covers.

**Links**

* [US-Account-01 — Delete own account](../account/US-Account-01-Delete-own-account.md)
* [US-Auth-02 — Account confirmation](../auth/US-Auth-02-Account-confirmation.md)
* [US-Channels-02 — Switch between channels](./US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-03 — Current channel settings](./US-Channels-03-current-channel-settings.md)
* [US-Notifications-01 — Configure notifications](../notifications/US-Notifications-01-Notifications-config.md)
* [US-Subscriptions-01 — Subscribe to other channels](../subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)
* [US-Videos-03 — Manage own videos](../videos/US-Videos-03-Manage-own-videos.md)

**Tasks**

BE:

* TODO

FE:

* TODO
