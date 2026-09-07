## US-Auth-06 — Logging out

**Description**

As an authenticated user with a verified account, I want to log out of my account, so that I end my current session and
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
  ([US-Auth-5](US-Auth-05-Session-management.md)); logout is treated as successful and the user is redirected to the
  login page.

**Acceptance criteria**

* The "Log out" action is shown in the sidebar on every page that has the sidebar, as long as the user is logged in —
  not only on pages that require authentication.
* Logging out requires a confirmation, and the modal explains what will happen.
* Cancelling the confirmation leaves the session untouched.
* On confirmation, the current session is ended on the server and both tokens are cleared on the client.
* The user is redirected to the login page and cannot return to authenticated pages with the browser's "back" button.
* After logging out, the refresh token no longer works — the session cannot be restored without logging in again.
* The ended session disappears from the session list ([US-Auth-5](US-Auth-05-Session-management.md)).
* A failed logout request still logs the user out locally and redirects to the login page.
* Logging out affects only the current session; other sessions of the account stay active.

**Tech notes**

* Use the Keycloak logout endpoint to end the session; clearing the cookies alone is not enough, as the refresh token
  would stay valid on the server.
* The Keycloak logout endpoint may end **all** sessions of the user, not just the current one. Investigate this when the
  story is picked up and find the way to end only the current session (e.g. back-channel logout for a specific session
  id via the admin API). If it turns out to be impossible, the "only the current session is affected" criterion has to
  be revisited.
* Clear the httpOnly auth cookies on the server response, and reset any cached user state on the client (query cache,
  stores) so no personal data stays behind after logout.
* Log out across browser tabs: other open tabs of the app should notice the ended session and move to the login page as
  well.

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-4 — Session persistence](US-Auth-04-Session-persistence.md)
* [US-Auth-5 — Session management](US-Auth-05-Session-management.md)

**Tasks**

BE:

* TODO

FE:

* TODO