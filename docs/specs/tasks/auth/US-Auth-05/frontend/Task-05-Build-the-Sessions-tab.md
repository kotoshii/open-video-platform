## Build the Sessions tab

Needs: [Task-02 — auth-api: Implement GET /auth/sessions](../backend/Task-02-auth-api-Implement-GET-auth-sessions.md)

Add the "Sessions" tab to the settings page
([US-Channels-03](../../../../user-stories/channels/US-Channels-03-current-channel-settings.md)). It lists the
account's active sessions: the current one on top, visually separated from the rest, then the others in the order the
server returned them.

Each entry shows the OS, the device name, the user agent, the IP address, the location, when it was created and when it
was last used.

Branch — a session has no location:

1. The entry says the location is unknown.

Branch — the list fails to load:

1. The tab shows the section error state with a retry.

Why: the order comes from the server and there are no sorting controls, so the tab renders what it is given.
