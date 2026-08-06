## US-Auth-5 — Session management

**Description**

As an authenticated user with a verified account, I want to see all my active sessions in one place and end any of them,
so that I can check where my account is logged in and cut off access from devices I no longer use or don't recognise.

A session entry contains: OS, device name, user agent, IP address, location (country, city), creation time and last
usage time. Ending a session means the account has to log in again on that device or browser. The current session is not
ended from this page — for that the user logs out (see [US-Auth-6](./US-Auth-6-Logging-out.md)).

**User flows**

See the list of sessions:

1. User opens the settings page from the left sidebar.
2. User opens the "Sessions" tab.
3. User sees the current session on top, visually separated from the rest of the list.
4. Below it, user sees the list of their other active sessions.
5. Each entry shows OS, device name, user agent, IP address, location (country, city), last usage time and creation
   time.

End a single session — main flow:

1. User hovers over a session entry and the "end session" button appears.
2. User clicks the button.
3. A confirmation modal appears, stating that this will end the selected session and showing that session's details, so
   the user doesn't end the wrong one by mistake.
4. User confirms.
5. The session is ended and the list refreshes with the remaining sessions.

End all sessions except the current one — main flow:

1. User clicks the "End all other sessions" button, which clearly states that it affects every session except the
   current one.
2. A confirmation modal appears.
3. User confirms.
4. All other sessions are ended and the list refreshes, leaving only the current session.

Branches:

* **User cancels the confirmation** — the modal closes, nothing changes.
* **Session already ended elsewhere** — the entry is gone on the server; the app refreshes the list and shows the actual
  state instead of an error.
* **No other sessions** — only the current session is shown, and the "End all other sessions" action is unavailable.

**Acceptance criteria**

* The settings page has a "Sessions" tab listing all active sessions of the account.
* Each entry shows OS, device name, user agent, IP address, location (country, city), creation time and last usage time.
* The current session is always shown on top and visually separated from the other sessions.
* Other sessions are listed in the order returned by the server; no sorting controls are needed.
* A single session can be ended from its entry in the list.
* Ending any session requires a confirmation, and the modal shows which session is about to be ended.
* All sessions except the current one can be ended with a single action, also behind a confirmation.
* After a session is ended, the list refreshes and no longer shows it.
* An ended session can no longer refresh its tokens — the next request from that device leads to the login page.
* The current session cannot be ended from this page; it is ended only by logging out.
* Failures while loading or ending sessions are shown as readable errors (see
  [US-UI-UX-2](../general-ui-ux/US-UI-UX-2-User-friendly-errors.md)).

**Tech notes**

* Keycloak already stores sessions and exposes an API to list and end them — no own session storage is needed.
* OS and device name are derived by parsing the user agent; keep the raw user agent as well, since parsing is
  best-effort.
* Location comes from a GeoIP lookup by IP; resolve it when the session is created and store the result, don't look it
  up on every list request. Location may be unknown — the UI must handle that.
* Ending a session must invalidate its refresh token, not only the access token; otherwise the device stays logged in
  until the access token expires.
* Access tokens stay valid until they expire, so a short access token lifetime keeps the gap between "ended" and
  "actually cut off" small.

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-4 — Session persistence](./US-Auth-4-Session-persistence.md)
* [US-Auth-6 — Logging out](./US-Auth-6-Logging-out.md)

**Tasks**

BE:

* TODO

FE:

* TODO