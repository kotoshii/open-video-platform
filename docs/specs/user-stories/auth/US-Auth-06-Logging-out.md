## US-Auth-06 — Logging out

**Description**

As an authenticated user, I want to log out of my account, so that I end my current session and
leave the app in a state where nobody can keep using it on this device without logging in again.

**User flows**

Logging out — main flow:

1. User clicks the "Log out" button in the sidebar.
2. A confirmation modal appears, saying the user won't be able to keep using the app until they log in again.
3. User confirms.
4. The current session is ended and the stored tokens are cleared.
5. User is redirected to the login page.

Logging out — branches:

* **User cancels the confirmation** (step 3) — the modal closes, the session stays active, nothing changes.
* **Logout request fails** (step 4) — the app still clears the local session and redirects to the login page; the user
  is never left in a half-logged-out state.
* **Session already ended elsewhere** (step 4) — e.g. it was ended from another device
  ([US-Auth-05](US-Auth-05-Session-management.md)); logout is treated as successful and the user is redirected to the
  login page.

**Acceptance criteria**

* The "Log out" action is in the sidebar, on every page that has one
  ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
* Logging out requires a confirmation, and the modal explains what will happen.
* Cancelling the confirmation leaves the session untouched.
* On confirmation, the current session is ended on the server and both tokens are cleared on the client.
* The user is redirected to the login page and cannot return to authenticated pages with the browser's "back" button.
* After logging out, the refresh token no longer works — the session cannot be restored without logging in again.
* The ended session disappears from the session list ([US-Auth-05](US-Auth-05-Session-management.md)).
* A failed logout request still logs the user out locally and redirects to the login page.
* Logging out affects only the current session; other sessions of the account stay active.

**Tech notes**

* End the session in Keycloak, not only on the client — clearing the cookies alone leaves the refresh token valid on
  the server.
* Keycloak ends exactly one session through its admin API: `DELETE /admin/realms/{realm}/sessions/{session}` ("Remove a
  specific user session"). The current session's id is the `sid` claim of the access token, so logging out is: read
  `sid` from the token, delete that session. Every other session of the account is untouched.
* Clear the httpOnly auth cookies on the server response, and reset any cached user state on the client (query cache,
  stores) so no personal data stays behind after logout.
* Log out across browser tabs: other open tabs of the app should notice the ended session and move to the login page as
  well.

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-04 — Session persistence](US-Auth-04-Session-persistence.md)
* [US-Auth-05 — Session management](US-Auth-05-Session-management.md)

**Tasks**

BE:

* TODO

FE:

* TODO