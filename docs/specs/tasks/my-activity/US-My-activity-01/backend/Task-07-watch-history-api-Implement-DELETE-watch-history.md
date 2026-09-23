## watch-history-api: Implement DELETE /watch-history

Needs: [Task-01 — Create watch-history-api](Task-01-Create-watch-history-api.md)

`DELETE /watch-history`

Main flow:

1. In one transaction, delete every row of the acting channel, set its last-cleared time, and write the history-cleared
   event to the outbox.

Why: this is one request, not a BullMQ job. Deleting by an indexed channel id is fast for any realistic history, and the
slow part — cleaning up Gorse — already happens asynchronously through the event. If one channel's history ever grows
large enough for the delete to run long, move it to a job that deletes in chunks.
