## notification-worker: Create reply and mention notifications

Needs: [Task-05 — comment-api: Carry the recipients on comment events](Task-05-comment-api-Carry-the-recipients-on-comment-events.md),
[Task-02 — Create notification-worker](Task-02-Create-notification-worker.md)

Consume the reply created event and create at most one notification per recipient.

Main flow:

1. The author of the thread's top-level comment gets a Reply notification.
2. The mentioned channel gets a Mention notification — unless it started the thread, in which case its Reply already
   covers it.
3. Skip any recipient that is the replier itself, or has the type turned off in-app.
4. Store the replier's name, the text, the comment and the video as they are now, with the event time as `activity_at`.

The notification stays when its comment is deleted later.

Why: these are individual notifications — one row per event, never an upsert. The name and the text are copied as they
were, so a later rename or edit changes neither, just as neither could change an email already sent. Another channel of
the same account is a separate identity and is notified like anybody else.
