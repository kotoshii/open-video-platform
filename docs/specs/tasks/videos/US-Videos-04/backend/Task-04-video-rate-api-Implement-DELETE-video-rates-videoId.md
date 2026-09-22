## video-rate-api: Implement DELETE /video-rates/{videoId}

Needs: [Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](Task-03-video-rate-api-Implement-POST-video-rates-videoId.md)

`DELETE /video-rates/{videoId}`

Main flow:

1. Take the acting channel from the header.
2. In one transaction, delete the rate and write the deleted event to the outbox.

Branch — there is no rate to remove:

1. Answer as a success.

Why: the delete goes through the outbox too — today this path emits its event with no error handling at all, while the
create rolls the rate back, which is the same failure handled two different ways in one file.
