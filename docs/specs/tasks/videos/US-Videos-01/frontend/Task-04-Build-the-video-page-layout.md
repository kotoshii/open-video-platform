## Build the video page layout

Needs: [Task-01 — video-api: Implement GET /videos/{videoId}/watch](../backend/Task-01-video-api-Implement-GET-videos-videoId-watch.md)

Build the page a video item anywhere in the app opens.

Main flow:

1. On desktop: the player, the title and the video's details in the main column, the comments below them, and the
   similar videos down the right column.
2. On mobile: one column — player, title, views and date, then the channel row, then a horizontally scrollable row of
   actions holding the like and dislike buttons, "More info" and "Comments".
3. "More info" opens the description in a bottom drawer and "Comments" opens the comments section in one, with the
   player and title still visible above.

The slots those parts fill come from their own stories: the comments
([US-Comments-01](../../../../user-stories/comments/US-Comments-01-See-comments.md)), the similar videos
([US-Recommendations-02](../../../../user-stories/recommendations/US-Recommendations-02-Similar-videos.md)), the
subscribe button, the rate buttons and the download button.

Why: a failure inside one of those sections shows its own error state and leaves the video playing — only the video's
own request can take the page down.
