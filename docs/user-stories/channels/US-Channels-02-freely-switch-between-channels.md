## US-Channels-02 — Switch between channels freely

**Description**

As an authenticated user with several channels, I want to switch between them freely, so that I can act as any of my
channels without logging out and logging in again.

**User flows**

Switch the current channel — main flow:

1. User clicks the arrow button next to their avatar (collapsed sidebar) or next to the channel name (expanded sidebar
   and mobile).
2. A popup (desktop) or a bottom drawer (mobile) opens with the list of the account's existing channels.
3. User clicks the desired channel.
4. The page reloads with the selected channel as the current identity.

Switch the current channel — branches:

* **Only one channel on the account** (step 2) — the list shows that channel alone; there is nothing to switch to, only
  the "Create new channel" action ([US-Channels-01](./US-Channels-01-create-multiple-channels.md)).
* **Stored channel no longer exists** (step 4) — e.g. it was deleted meanwhile
  ([US-Channels-06](./US-Channels-06-delete-own-channel.md)); the gateway rejects the channel id, the app drops the
  stored value and asks the user to pick a channel again.

**Acceptance criteria**

* The channel switcher is reachable from the sidebar on every page, in both sidebar states and on mobile.
* The switcher lists all channels of the account and highlights the current one.
* Selecting a channel makes it the current identity and reloads the page.
* Switching does not re-authenticate the user and does not issue new tokens.
* The current channel survives page reloads and app restarts.
* Every request carries the current channel id, and a channel id that does not belong to the account is rejected.

**Tech notes**

* Switching follows the "act as" pattern: no new JWT is generated, because the token identifies the account and already
  carries every channel the account owns in the `channelIds` claim.
* The current channel id is kept in localStorage and sent in a header; the gateway validates it against the
  `channelIds` claim of the verified token and rejects the request if it doesn't match.
* Keeping the channel outside the token is what makes switching cheap — no token refresh, no session change, and the
  session list ([US-Auth-5](../auth/US-Auth-5-Session-management.md)) stays about devices, not identities.
* localStorage is per browser, so the current channel is per device: the same account can act as different channels on
  different devices at the same time.
* localStorage is not readable during server-side rendering — decide how server-rendered pages get the current channel
  (e.g. mirroring it into a cookie).

**Links**

* [US-Auth-1 — Account creation and login](../auth/US-Auth-1-Account-creation-and-login.md)
* [US-Channels-01 — Create multiple channels](./US-Channels-01-create-multiple-channels.md)
* [US-Channels-06 — Delete own channel](./US-Channels-06-delete-own-channel.md)

**Tasks**

BE:

* TODO

FE:

* TODO
