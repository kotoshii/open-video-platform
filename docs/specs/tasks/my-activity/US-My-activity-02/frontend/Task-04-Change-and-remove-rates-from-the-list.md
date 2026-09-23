## Change and remove rates from the list

Needs: [Task-03 — Build the rated videos page](Task-03-Build-the-rated-videos-page.md),
[US-Videos-04 Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](../../../videos/US-Videos-04/backend/Task-03-video-rate-api-Implement-POST-video-rates-videoId.md),
[US-Videos-04 Task-04 — video-rate-api: Implement DELETE /video-rates/{videoId}](../../../videos/US-Videos-04/backend/Task-04-video-rate-api-Implement-DELETE-video-rates-videoId.md)

Make the like and dislike buttons on each row work, through the same endpoints as the video page.

Main flow — the opposite button:

1. The rate switches straight away, before the server answers, and the list is not loaded again.

Main flow — the filled button:

1. A confirmation modal says the video will leave this list.
2. On confirm, remove the rate and load the list again.

Branch — switching to a dislike while "Show only liked videos" is on:

1. The row stays where it is, showing the dislike, until the list is loaded again.

Branch — the row is a placeholder:

1. The opposite button is disabled; the filled one removes the rate as usual.

Branch — the author has turned rates off:

1. The switch is refused; the button goes back and a toast explains why.

Branch — any other failure:

1. The button goes back to what it was, and a toast says what went wrong.

Why: switching keeps the row on its page, so nothing needs reloading; removing takes it off the list and shifts the
pages after it, so that one reloads.
