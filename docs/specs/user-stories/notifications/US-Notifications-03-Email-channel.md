## US-Notifications-03 — Email notifications

**Description**

As a registered user with a verified account, I want replies to my comments and mentions of my channel to reach me by
email when I have turned that on, so that I find out about conversations I'm part of without having the app open.

**User flows**

Receive an email — main flow:

1. Someone replies to one of the channel's comments or mentions the channel, exactly as defined in
   [US-Notifications-01](./US-Notifications-01-Notifications-config.md).
2. The channel has email turned on for that type.
3. An email arrives at the account's email address.
4. The email says which channel it concerns and who replied or mentioned, and previews the comment cut after 200
   characters.
5. A link in the email opens the video with that comment thread.
6. The footer links to that channel's notification preferences.

Receive an email — branches:

* **More activity in the same thread soon after** (step 3) — it does not send an email each time. Replies and mentions
  in that thread within the following 15 minutes are gathered into one follow-up email.
* **Email turned off for the type** (step 2) — no email is sent; the in-app notification is still created if in-app is
  on ([US-Notifications-02](./US-Notifications-02-In-app-channel.md)).
* **The comment is deleted before its email goes out** (step 3) — for example while it waits to be gathered into a
  follow-up. It is left out, and if nothing is left, no email is sent.

**Acceptance criteria**

* Only Replies to my comments and Mentions can be sent by email; the other types never are.
* An email is sent only for a type the channel has email turned on for, and email is off by default.
* The email goes to the account's email address and names the channel it concerns, since all channels of an account
  share one inbox.
* The email names who replied or mentioned, and previews the comment cut after 200 characters — the same length as in
  the notification center.
* The email links to the video with that comment thread open.
* The footer links to the notification preferences of the channel the email concerns.
* The first reply or mention in a thread is emailed straight away; further ones in the same thread within 15 minutes
  arrive together in a single follow-up email.
* A channel is never emailed about its own action.
* A channel scheduled for deletion still sends and receives notification emails, since it is still live
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)); its purge is what stops them.

**Tech notes**

* Emails go through the custom email module ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)) and are
  triggered by an event, never sent inline.
* Templates use Handlebars. Comment text is user input, so it must be rendered with the escaping `{{ }}` and never with
  `{{{ }}}` — otherwise a comment can put its own markup into the email.
* The preview is 200 characters in both the email and the notification center. The comments section truncates at 400
  ([US-Comments-01](../comments/US-Comments-01-See-comments.md)) — a different limit for a different place, not to be
  reused here.
* Gathering follow-ups is the delayed-flush mechanism from
  [notification-aggregation.md](../../../explainers/notification-aggregation.md), keyed by recipient channel and thread
  instead of by
  type, with one difference: the first event is sent immediately. It also opens a 15-minute window and schedules a flush
  for the end of it; events inside the window only accumulate; the flush sends one email if anything accumulated, then
  closes the window. BullMQ delayed jobs already do this kind of work for video processing.
* Preferences are checked again when the flush runs, since the user may turn email off while events are waiting.
* The link into a specific thread is the video page's `?comment=<id>` link
  ([US-Comments-01](../comments/US-Comments-01-See-comments.md)).
* Notification emails are written in the recipient account's email language
  ([US-I18n-03](../i18n/US-I18n-03-Localized-emails.md)).

**Links**

* [US-Auth-02 — Account confirmation](../auth/US-Auth-02-Account-confirmation.md)
* [US-Comments-01 — See comments](../comments/US-Comments-01-See-comments.md)
* [US-Notifications-01 — Configure notifications](./US-Notifications-01-Notifications-config.md)
* [US-Notifications-02 — In-app notifications](./US-Notifications-02-In-app-channel.md)
* [notification-aggregation.md](../../../explainers/notification-aggregation.md)

**Tasks**

BE:

* TODO
