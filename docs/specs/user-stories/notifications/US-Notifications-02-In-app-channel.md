## US-Notifications-02 — In-app notifications

**Description**

As a registered user, I want to see my channel's notifications in one place and keep track of
which ones I have read, so that I don't miss replies, mentions and what is happening on my channel.

**User flows**

Open the notification center — main flow:

1. User sees a badge with the number of unread notifications on the "Notifications" item in the sidebar.
2. User opens the notification center from the sidebar.
3. User sees the current channel's notifications, read and unread, most recent activity first.
4. Unread notifications stand out — darker, with an outline — while read ones are lighter and have no outline.
5. Each notification shows a title, its text and when it happened.
6. For replies and mentions, the text is a preview of the comment cut after 200 characters, with "See more" to expand
   it.
7. The list is paginated, with page controls at the bottom.

Open what a notification is about:

1. User clicks a notification.
2. A reply or a mention opens the video with that comment thread; a new comments notification opens the video. The
   notification is marked as read.

Mark one as read:

1. User hovers over an unread notification and the "Hide" and "Mark as read" buttons appear.
2. User clicks "Mark as read".
3. The notification becomes read straight away, with no confirmation, and the badge count goes down.

Hide a notification:

1. User hovers over a notification and clicks "Hide". A read notification shows only this button.
2. A confirmation modal appears.
3. User confirms.
4. The notification is marked as read and removed from the list.

Mark all as read:

1. User clicks "Mark all as read" at the top of the list.
2. A confirmation modal appears.
3. User confirms.
4. Every unread notification of the current channel becomes read and the badge disappears.

Branches:

* **Nothing unread** — the badge is not shown and "Mark all as read" is disabled.
* **No notifications at all** — the list shows an empty state.
* **Cancelling a confirmation** — the modal closes and nothing changes.
* **What the notification points at is gone** — the comment or the video has been deleted; opening it says the content
  is no longer available instead of showing an error.
* **The list fails to load** — a full-page error state with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **An action fails** — marking as read, hiding or marking all as read; the default toast behaviour applies and the
  notifications stay as they were.

**Acceptance criteria**

Badge:

* The "Notifications" item in the sidebar shows a badge with the number of unread notifications for the current
  channel, and no badge when there are none.
* The badge counts notifications, not events — one aggregated notification about 47 subscribers counts as one.
* The count is loaded with the page. It is not polled and is not refreshed by moving between pages inside the app, so
  notifications that arrive in the meantime show up after a page reload.
* The user's own actions — opening, marking as read, hiding, marking all as read — update the badge immediately.

List:

* The notification center lists the current channel's notifications, read and unread, ordered by most recent activity.
* Every notification shows when it happened, as relative time like the rest of the app: when it was created for a
  reply or a mention, and when it was last updated for an aggregated notification.
* Unread notifications are darker and outlined; read ones are lighter and not outlined.
* Replies and mentions name the channel that replied or mentioned, and preview the comment cut after 200 characters,
  expandable with "See more".
* Aggregated notifications show a count without names, in the singular or plural as needed — "1 person has subscribed
  to your channel recently", "47 people have subscribed to your channel recently".
* The list is paginated with page controls at the bottom, not infinite scroll.

Actions:

* Hovering over an unread notification shows "Hide" and "Mark as read"; over a read one, only "Hide". On mobile the
  buttons are always visible.
* "Mark as read" takes effect immediately, without a confirmation.
* "Hide" and "Mark all as read" ask for confirmation first.
* Hiding marks the notification as read and removes it from the list for good.
* "Mark all as read" affects only the current channel, and is disabled when nothing is unread.
* Clicking a reply or a mention opens the video with that comment thread, clicking a new comments notification opens
  the video, and either way the notification becomes read. A new subscribers notification has nothing to open.
* Opening a notification whose comment or video no longer exists says it is no longer available.

**Tech notes**

* How notifications are produced, aggregated and counted down belongs to
  [US-Notifications-01](./US-Notifications-01-Notifications-config.md) and
  [notification-aggregation.md](../../../explainers/notification-aggregation.md). This story is where they are shown.
* The time shown and the order of the list come from **one field computed on the server** — the activity time: when the
  notification was created for a reply or a mention, and when it was last increased for an aggregated one. The client
  displays and sorts by that single field and never decides which timestamp applies.
* **That field changes only on new activity.** Marking as read, hiding and counting down must leave it alone —
  otherwise reading an old notification, or somebody unsubscribing, would move it to the top of the list. A generic
  last-modified timestamp kept up to date by the ORM or a trigger is exactly the wrong column for it.
* Ordering by activity while paging with page controls means an aggregated notification that gains activity jumps to
  the first page while the user is on a later one, and entries shift between pages. That is accepted for a notification
  list.
* Reading or hiding an unread aggregated notification closes it, so the next event starts a new one. That falls out of
  the partial unique index in the aggregation doc and needs no handling of its own.
* The list, the badge and "Mark all as read" all key on the channel the user is acting as
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)).
* No filtering by author availability is needed when the list is served: a channel is never hidden while it exists, so
  a comment preview is either a live comment or a comment whose notification the purge has already taken with it
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)).
* Opening a reply or a mention needs the video page to open one specific comment thread directly. That thread may sit
  far down an infinitely scrolled comment list ([US-Comments-01](../comments/US-Comments-01-See-comments.md)), so it has
  to be loaded on its own — through a comment id in the URL, for example — rather than by scrolling until it appears.
* How long read notifications are kept needs a decided value; without one the table only ever grows.

**Links**

* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-01 — See comments](../comments/US-Comments-01-See-comments.md)
* [US-Notifications-01 — Configure notifications](./US-Notifications-01-Notifications-config.md)
* [US-Notifications-03 — Email notifications](./US-Notifications-03-Email-channel.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [notification-aggregation.md](../../../explainers/notification-aggregation.md)

**Tasks**

BE:

* TODO

FE:

* TODO
