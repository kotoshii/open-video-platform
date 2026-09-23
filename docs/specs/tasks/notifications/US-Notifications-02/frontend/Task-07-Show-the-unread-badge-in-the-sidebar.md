## Show the unread badge in the sidebar

Needs: [Task-02 — notification-api: Implement GET /notifications/unread-count](../backend/Task-02-notification-api-Implement-GET-notifications-unread-count.md),
[US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md)

Fill the badge slot on the sidebar's "Notifications" item with the acting channel's unread count, and show no badge when
it is zero.

Main flow:

1. The count loads with the page.
2. It is not polled, and moving between pages inside the app does not load it again.
3. The user's own actions — opening, reading, hiding, marking all as read — update it straight away.

Branch — the user switches channel:

1. The badge shows that channel's count.

Why: the count sits in the query cache with no refetch on navigation, which is what makes "new notifications show after
a reload" true. The user's own actions change the cached number instead of asking the server again.
