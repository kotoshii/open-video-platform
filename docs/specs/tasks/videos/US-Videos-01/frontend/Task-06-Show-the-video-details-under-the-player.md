## Show the video details under the player

Needs: [Task-04 — Build the video page layout](Task-04-Build-the-video-page-layout.md)

Render what sits under the player: the title, wrapping onto several lines when it is long; the view count and the upload
date as relative time; the author's avatar, channel name and subscriber count; and the description, collapsed with a
"See more..." that expands it in place.

Branch — the channel has no subscribers:

1. No subscriber count is shown.

Branch — the video belongs to the acting channel:

1. An edit button appears under the player, opening the management menu
   ([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)).

Branch — on mobile:

1. The description is not inline; "More info" opens it in the drawer, and a long channel name is truncated.

Why: dates are stored absolute and rendered relative, so they stay correct without the page asking the server again.
