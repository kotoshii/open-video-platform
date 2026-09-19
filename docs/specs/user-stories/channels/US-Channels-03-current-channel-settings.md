## US-Channels-03 — Current channel settings

**Description**

As an authenticated user with a verified account, I want to edit the info of the channel I'm currently acting as, so
that my channel shows the name, description and picture I want across the app.

**User flows**

Edit the current channel — main flow:

1. User clicks the settings button in the sidebar.
2. The settings page opens.
3. The page has two tabs:
    * **Channel** — user pic, channel name, channel description, the "Show age-restricted content" toggle, the
      notification preferences (see
      [US-Notifications-01](../notifications/US-Notifications-01-Notifications-config.md)), and the "Delete channel"
      button (see [US-Channels-06](./US-Channels-06-delete-own-channel.md));
    * **Account** — email, password, the email language
      ([US-I18n-03](../i18n/US-I18n-03-Localized-emails.md)), and the "Delete account" button (not related to channels —
      see the Account settings epic in [project-overview.md](../../../project-overview.md)).
4. The Channel tab is open by default.
5. User changes the channel name or description, or uploads a new user pic (see
   [US-Channels-05](./US-Channels-05-upload-user-pic.md)), and clicks "Save".
6. The request is sent; on success the user sees a success toast, on failure the default error flow applies
   ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
7. Every element on the page showing the changed values updates immediately (e.g. the channel name and avatar in the
   sidebar).
8. Elements owned by other microservices (e.g. videos, comments) may keep showing the old channel name or avatar for a
   short time.

Edit the current channel — branches:

* **Empty channel name** (step 5) — the field shows a validation error and the request is not sent.

**Acceptance criteria**

* The sidebar has a settings button that opens the settings page.
* The settings page has a "Channel" and an "Account" tab, with "Channel" open by default.
* The Channel tab contains the user pic, channel name, channel description, the "Show age-restricted content" toggle,
  the notification preferences and the "Delete channel" button.
* "Show age-restricted content" is **off by default**. While it is off, videos marked as unsuitable for younger
  viewers ([US-Videos-05](../videos/US-Videos-05-Upload-videos.md)) are left out of everything this channel browses —
  search results, the feed, similar videos and channel pages — and opening one directly shows the same blocked state
  an under-age viewer gets ([US-Videos-01](../videos/US-Videos-01-Watch-videos.md)).
* The toggle is only available to an account old enough for that content by its date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)); for anyone younger it is not shown, and the
  content stays hidden regardless.
* The setting belongs to the channel, so each channel of an account has its own.
* The Account tab contains email, password, the email language and the "Delete account" button; its content belongs to
  the Account settings and I18n epics, not to this story.
* When a deletion is already scheduled for the channel or the account, the corresponding tab states that, gives the
  date it will run, and offers "Cancel deletion" in place of the delete button
  ([US-Channels-06](./US-Channels-06-delete-own-channel.md),
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* Changes are applied only after an explicit "Save".
* The channel name cannot be empty; validation matches the creation form
  ([US-Channels-01](./US-Channels-01-create-multiple-channels.md)).
* A successful save shows a success toast; a failed one follows the default error flow.
* After a successful save, everything on the current page that shows the changed values reflects them right away.
* Data owned by other services may still show the previous name or avatar for a short time — this is expected, not a
  bug.

**Tech notes**

* When the channel name or avatar changes, the Channels service publishes a Kafka event so the services keeping their
  own copy of that data (videos, comments, subscriptions, search) can update it.
* This is deliberate eventual consistency: each service stores a denormalized copy of the channel name and avatar
  instead of querying the Channels service on every read, which is why the UI has to tolerate stale values for a while.
* Consumers must tolerate duplicate and out-of-order events — dedup via Redis, and ignore events older than the copy
  already stored.
* The settings page needs no service or endpoints of its own; it composes the existing per-service endpoints.
* **"Show age-restricted content" is a preference over the flag that already exists**, not a second classification.
  A video is marked once, on upload or in the edit dialog
  ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)); the date of birth decides whether a viewer *may* see
  that content, and this toggle decides whether they *want* to. Age is a permission and the toggle is a filter, which
  is why a user too young never sees the toggle at all.
* The setting is per channel like the notification preferences, so the services that filter listings — Search, the
  feed, similar videos, the channel page — read it for the acting channel alongside the age check they already do.
  Both filters are applied when a listing is served, never at index time, since either can change at any moment.

**Links**

* [US-Channels-01 — Create multiple channels](./US-Channels-01-create-multiple-channels.md)
* [US-Channels-05 — Upload user pic](./US-Channels-05-upload-user-pic.md)
* [US-Channels-06 — Delete own channel](./US-Channels-06-delete-own-channel.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
