## US-Notifications-01 — Configure notifications

**Description**

As a registered user with a verified account, I want to choose which notifications my channel receives and whether they
reach me in the app or by email, so that I hear about what matters to me without being flooded.

Preferences belong to a channel, not to the account: every channel has its own, and they apply to whichever channel the
user is currently acting as.

**User flows**

Change the preferences — main flow:

1. User opens the settings page on the Channel tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the notification preferences section: a table with a row per notification type and a column per delivery
   channel — In-app and Email.
3. The table has four types:
    * **New subscribers** — In-app only;
    * **New comments on my videos** — In-app only;
    * **Replies to my comments** — In-app and Email;
    * **Mentions** — In-app and Email.
4. User switches the toggles they want.
5. User clicks "Save".
6. The preferences are saved and a success toast is shown.

Change the preferences — branches:

* **Request fails** (step 6) — the default toast behaviour applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)), and the toggles keep the user's changes so saving can
  be
  retried.
* **Acting as another channel** (step 2) — the section shows that channel's own preferences.

How notifications are produced:

1. Something happens that matches one of the four types for this channel.
2. If the channel has that type turned off in-app, no notification is created.
3. **New subscribers** and **New comments on my videos** are aggregated: the event updates the channel's open, unread
   notification of that type — for comments, the one for that video — or creates it if there is none. The user sees a
   single notification with a growing count, such as "47 people have subscribed to your channel recently".
4. **Replies to my comments** and **Mentions** are individual: every event creates its own notification, naming who
   replied or mentioned.
5. For replies and mentions with email turned on, an email is sent as well
   ([US-Notifications-03](./US-Notifications-03-Email-channel.md)).

Counts going down:

1. A subscription is removed, or a comment is deleted.
2. If it was counted in the channel's open notification, that notification's count goes down by one.
3. If the count reaches zero, the notification is deleted.
4. If it was counted in an older notification the user has already read, nothing changes — history is left alone.

**Acceptance criteria**

Preferences:

* The Channel tab of the settings page has a notification preferences section.
* The section lists New subscribers, New comments on my videos, Replies to my comments and Mentions, with an In-app and
  an Email column.
* New subscribers and New comments on my videos offer only In-app; Replies to my comments and Mentions offer both.
* By default every In-app toggle is on and every Email toggle is off.
* Changes apply only after "Save". Success shows a toast; failure follows the default toast behaviour.
* Preferences belong to the channel the user is acting as, and switching channel shows that channel's own preferences.
* Turning a type off stops new notifications of that type; notifications already received stay.

What each type means:

* **New subscribers** — another channel subscribes to this channel.
* **New comments on my videos** — someone posts a top-level comment on one of this channel's videos. Replies are not
  counted here.
* **Replies to my comments** — someone replies in the thread of a top-level comment written by this channel, under any
  video, this channel's or another's. A reply to a reply inside that thread counts too.
* **Mentions** — someone mentions this channel in a reply, in a thread whose top-level comment belongs to another
  channel. A mention inside a thread this channel started counts as a reply instead.
* One event produces at most one notification per recipient. When an event could fit more than one type, the more
  specific one wins — a reply to my comment under my own video is a reply, not a new comment.
* A channel is never notified about its own actions. Another channel of the same account is a separate identity and is
  notified like anybody else.

Aggregation:

* New subscribers keep one open notification per channel, and New comments on my videos one per video.
* A new event updates the open notification instead of creating another; once the user reads or hides it, the next
  event starts a new one from one.
* Removing a subscription or deleting a comment lowers the open notification's count only if it was counted there, and a
  count that reaches zero deletes the notification.
* Deleting a video deletes its New comments notification.
* A reply or mention notification is kept when its comment is deleted. An email about it may already be in the inbox,
  and removing only the in-app copy would make the two disagree.

**Tech notes**

* Preferences are per channel because every trigger already is: subscriptions, comments and videos all belong to a
  channel, so the events carry the channel id and the preference lookup keys on it directly. Keying on the account
  would mean resolving channel to account for every single event.
* A channel with no stored preferences uses the defaults, and a row is written only when a user saves. Creating a
  channel — including the first one made at sign-up ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) —
  then writes nothing, and no path that creates a
  channel can forget to.
* Preferences are checked when a notification is written, not when it is shown.
* The aggregation mechanism — one open row per key, enforced by a partial unique index, closed when read — is written up
  step by step in [notification-aggregation.md](../../explainers/notification-aggregation.md).
* **Counting down needs to know which notification an item was counted in.** Without that, a subscriber counted in
  yesterday's already-read notification who unsubscribes today would lower today's unrelated count. No stored lists are
  needed: the aggregated notification records the event time of the first item it counted, the removal event carries
  when the subscription or comment was originally created, and the worker lowers the open notification only if that
  creation time is not earlier than the notification's first event.
* Both sides of that comparison must be event times. The moment the worker processed a batch lags behind by up to a
  batch, so comparing against it would skip the decrement for the very item that opened the notification.
* Mentions rely on the reply carrying the mentioned channel as structured data
  ([US-Comments-04](../comments/US-Comments-04-Reply-to-comments.md)). A channel name is never parsed out of comment
  text: names are not guaranteed to be unique, and the prefilled text can be edited.
* Creating, increasing and decreasing notifications must all be idempotent, because Kafka redelivers batches. Use the
  inbox approach from [kafka-dedup-and-inbox-pattern.md](../../explainers/kafka-dedup-and-inbox-pattern.md), and do not
  build this
  worker on the current `BaseCountWorkerService` deduplication, which has the reserve-before-write problem described in
  [known-issues.md](../../known-issues.md).
* New videos from subscriptions and likes on videos are not notification types for now.

**Links**

* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Comments-04 — Reply to comments and replies](../comments/US-Comments-04-Reply-to-comments.md)
* [US-Notifications-02 — In-app notifications](./US-Notifications-02-In-app-channel.md)
* [US-Notifications-03 — Email notifications](./US-Notifications-03-Email-channel.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [notification-aggregation.md](../../explainers/notification-aggregation.md)

**Tasks**

BE:

* TODO

FE:

* TODO
