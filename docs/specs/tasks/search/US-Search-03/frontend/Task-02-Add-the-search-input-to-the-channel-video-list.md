## Add the search input to the channel video list

Needs: [Task-01 — video-api: Search a channel's videos](../backend/Task-01-video-api-Search-a-channels-videos.md),
[US-Channels-04 Task-04 — Build the channel video list](../../../channels/US-Channels-04/frontend/Task-04-Build-the-channel-video-list.md)

Add the search input on the same line as the Newest, Most viewed and Oldest buttons above the video list, submitted
with Enter or its button. The subscriptions page reuses it
([US-Subscriptions-03](../../../../user-stories/subscriptions/US-Subscriptions-03-Subscription-content-page.md)).

Main flow:

1. Searching sends the query with the current sorting and replaces the list with the results.
2. Clicking a result opens the video page, exactly as from the unfiltered list.

Branch — on mobile:

1. The input is hidden behind a search icon next to the sort buttons, and appears below them when pressed.

Branch — nothing matched:

1. An empty state in place of the list, saying nothing in this channel matched.

Branch — the request fails:

1. A toast, and the current list stays — this is an action on a page that has already loaded.

Why: the user stays on the channel page rather than being taken to the global search, so what they find is always
within the channel they were looking at.
