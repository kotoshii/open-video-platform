## Build the app shell layout

Needs: [_platform frontend Task-02 — Set up the route groups](../../../_platform/frontend/Task-02-Set-up-the-route-groups.md)

Build the shell every signed-in page renders inside, as the `(app)` route group's layout: the navbar across the top, the
sidebar down the left, and the page content beside it.

* On desktop the navbar holds the menu button on its left, and slots for the search bar
  ([US-Search-01](../../../../user-stories/search/US-Search-01-Search-videos.md)) and the "Upload" button
  ([US-Videos-05](../../../../user-stories/videos/US-Videos-05-Upload-videos.md)).
* On mobile it holds the menu button and the search slot only.
* The content area scrolls on its own; the navbar and the sidebar stay where they are.

Why: the shell belongs to the route group, so a page cannot render without it or show it by accident — which is why the
auth pages sit in the other group.
