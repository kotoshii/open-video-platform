## Build the notification center

Needs: [Task-01 — notification-api: Implement GET /notifications](../backend/Task-01-notification-api-Implement-GET-notifications.md),
[US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md)

Build the page the sidebar's "Notifications" item opens: "Mark all as read" at the top, the list, page controls at the
bottom, and a short note that read notifications are deleted 90 days after they were read.

Main flow:

1. Unread notifications are darker and outlined; read ones are lighter, with no outline.
2. Each shows a title, its text, and its activity time as relative time.
3. Aggregated ones show the count in the singular or the plural — "1 person has subscribed to your channel recently",
   "47 people have subscribed to your channel recently" — and new comments name the video.
4. Replies and mentions name the channel and preview the text cut after 200 characters, with "See more" expanding it in
   place.

Branch — nothing is unread:

1. "Mark all as read" is disabled.

Branch — there are no notifications:

1. An empty state.

Branch — the list fails to load:

1. A full-page error state with a retry.

Why: the plurals go through the i18n library's plural rules rather than a check for one — Ukrainian has more plural
forms than English, so "1 or many" is wrong for it.
