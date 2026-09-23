## Add Log out to the sidebar with a confirmation

Needs: [Task-01 — auth-api: Implement POST /auth/logout](../backend/Task-01-auth-api-Implement-POST-auth-logout.md),
[US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md)

Put "Log out" in the slot at the bottom of the sidebar, styled as destructive, and wire it up.

Main flow:

1. User clicks it and a modal explains that they will have to log in again to keep using the app.
2. On confirm the app calls the logout endpoint, clears the query cache and any stored state, and opens the log in page.
3. Other open tabs notice and move to the log in page too.
4. The browser's back button does not bring an authenticated page back.

Branch — the user cancels:

1. The modal closes and the session is untouched.

Branch — the request fails:

1. The app clears everything and goes to the log in page anyway, so nobody is left half logged out.

Why: the cookies are cleared by the response, but a tab that is already open keeps its cached data until something tells
it — which is what the cross-tab message is for.
