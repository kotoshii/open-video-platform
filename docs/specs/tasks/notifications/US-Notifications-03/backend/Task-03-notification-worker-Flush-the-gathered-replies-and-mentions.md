## notification-worker: Flush the gathered replies and mentions

Needs: [Task-02 — notification-worker: Email the first reply or mention in a thread](Task-02-notification-worker-Email-the-first-reply-or-mention-in-a-thread.md)

Handle the delayed flush job for a recipient and a thread, and keep the pending items clean while they wait.

Main flow — a comment is deleted:

1. Delete its pending item, if it has one, from the comment deleted event the worker already consumes.

Main flow — the flush:

1. Read and delete the pending items for that recipient and thread.
2. Read the recipient's preferences again, and drop the items whose type has email turned off since.
3. If anything is left, publish one send-email event with all of it.

Branch — nothing is left, or the recipient channel no longer exists:

1. Send nothing.

Why: the user may turn email off, or delete a reply, while it waits in the window — so both are checked again when the
email is about to go out, not when the reply arrived.
