## US-Channels-01 — Create multiple channels on one account

**Description**

As an authenticated user with a verified account, I want to create additional channels on my account, so that I can keep
separate identities for different kinds of content without registering another account.

**User flows**

Create a channel — main flow:

1. User clicks the arrow button next to their avatar (collapsed sidebar) or next to the channel name (expanded sidebar
   and mobile).
2. A popup (desktop) or a bottom drawer (mobile) opens with the list of the account's existing channels.
3. At the very bottom of the list there is a "Create new channel" button.
4. User clicks it.
5. A modal (desktop and mobile) opens with the creation form: avatar upload (optional), channel name (required),
   description (optional).
6. User fills in the form.
7. User clicks "Create".
8. The channel is created.
9. User sees a success toast notification.
10. The page reloads with the new channel as the current identity.

Create a channel — branches:

* **Empty channel name** (step 7) — the field shows a validation error and the request is not sent.
* **Request fails** (step 8) — the default error flow applies: a toast notification
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)); the modal stays open with the entered data.

**Acceptance criteria**

* The channel switcher opens from the sidebar and lists all channels of the account.
* The switcher has a "Create new channel" button at the very bottom of the list.
* The creation form has channel name (required), description (optional) and avatar (optional).
* The channel name cannot be empty.
* On success the user sees a success toast and the app reloads with the new channel as the current identity.
* Failures follow the default error flow ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* The account's first channel is created together with the account, not through this flow
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)).

**Tech notes**

* Channels are not part of the auth flow — an account acting as one of its channels follows an "act as" pattern, not a
  separate login.
* The channel id is never stored in the JWT. The client sends it in a header, and the gateway validates it against the
  `channelIds` claim of the verified token, passing the request through when it matches and rejecting it when it
  doesn't.
* Creation is the one case that needs new tokens: the new channel has to appear in the `channelIds` claim, so the token
  pair is re-issued once the channel is created. This is also why creation reloads the page while switching
  ([US-Channels-02](./US-Channels-02-freely-switch-between-channels.md)) does not.
* Once a channel is created, publish a Kafka event so the other services can pick it up (e.g. Search, to index the new
  channel).
* The maximum number of channels per account needs a decided value.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Channels-02 — Switch between channels](./US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-05 — Upload user pic](./US-Channels-05-upload-user-pic.md)

**Tasks**

BE:

* TODO

FE:

* TODO
