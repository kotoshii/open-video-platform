## Add the rate buttons to the video page

Needs: [Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](../backend/Task-03-video-rate-api-Implement-POST-video-rates-videoId.md),
[Task-05 — video-rate-api: Implement GET /video-rates/{videoId}](../backend/Task-05-video-rate-api-Implement-GET-video-rates-videoId.md),
[US-Videos-01 Task-06 — Show the video details under the player](../../US-Videos-01/frontend/Task-06-Show-the-video-details-under-the-player.md)

Add the like and dislike buttons under the player, each with its count, and the ratio bar beneath them.

Main flow:

1. The page loads the acting channel's own rate and fills the matching button.
2. Clicking an inactive button activates it straight away, before the server answers; the counts stay as they are.
3. Clicking the active one removes the rate; clicking the opposite one moves it.

Branch — the video has no likes or no dislikes:

1. That button shows no number, and with no rates at all the bar is neutral.

Branch — the author turned rates off:

1. Neither the buttons nor the bar are rendered.

Branch — the request fails:

1. The button goes back to what it was, and a toast says what went wrong.

Why: the counts are never adjusted on the client. The active button already confirms the click, and the stored number
catches up when the worker applies the batch — so "0" never appears next to a button the user has just pressed.
