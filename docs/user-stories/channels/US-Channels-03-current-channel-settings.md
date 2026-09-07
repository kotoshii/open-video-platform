## US-Channels-03 — Current channel settings

**Description**

As an authenticated user with a verified account, I want to edit the info of the channel I'm currently acting as, so
that my channel shows the name, description and picture I want across the app.

**User flows**

Edit the current channel — main flow:

1. User clicks the settings button in the sidebar.
2. The settings page opens.
3. The page has two tabs:
    * **Channel** — user pic, channel name, channel description, and the "Delete channel" button (see
      [US-Channels-06](./US-Channels-06-delete-own-channel.md));
    * **Account** — email, password, and the "Delete account" button (not related to channels — see the Account
      settings epic in [project-overview.md](../../project-overview.md)).
4. The Channel tab is open by default.
5. User changes the channel name or description, or uploads a new user pic (see
   [US-Channels-05](./US-Channels-05-upload-user-pic.md)), and clicks "Save".
6. The request is sent; on success the user sees a success toast, on failure the default error flow applies
   ([US-UI-UX-2](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
7. Every element on the page showing the changed values updates immediately (e.g. the channel name and avatar in the
   sidebar).
8. Elements owned by other microservices (e.g. videos, comments) may keep showing the old channel name or avatar for a
   short time.

Edit the current channel — branches:

* **Empty channel name** (step 5) — the field shows a validation error and the request is not sent.

**Acceptance criteria**

* The sidebar has a settings button that opens the settings page.
* The settings page has a "Channel" and an "Account" tab, with "Channel" open by default.
* The Channel tab contains the user pic, channel name, channel description and the "Delete channel" button.
* The Account tab contains email, password and the "Delete account" button; its content belongs to the Account settings
  epic, not to this story.
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

**Links**

* [US-Channels-01 — Create multiple channels](./US-Channels-01-create-multiple-channels.md)
* [US-Channels-05 — Upload user pic](./US-Channels-05-upload-user-pic.md)
* [US-Channels-06 — Delete own channel](./US-Channels-06-delete-own-channel.md)
* [US-UI-UX-2 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
