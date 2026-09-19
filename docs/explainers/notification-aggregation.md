# Keeping notifications from turning into a stream

How to tell someone that 23 people subscribed without sending them 23 notifications — or, worse, a new one every ten
seconds saying a slightly larger number. Also: how counts go back down, what time a notification shows, and why email
works differently.

Written up for the Notifications epic:
[US-Notifications-01](../specs/user-stories/notifications/US-Notifications-01-Notifications-config.md) (the types and the
rules), [US-Notifications-02](../specs/user-stories/notifications/US-Notifications-02-In-app-channel.md) (the notification
center) and [US-Notifications-03](../specs/user-stories/notifications/US-Notifications-03-Email-channel.md) (email).

---

## Part 1 — The problem

A channel gets ten new subscribers in ten seconds.

The naive approach creates one notification per event, so the user opens the app and finds ten rows that all say the
same thing. Obviously bad.

The first instinct is to group events by Kafka batch: the worker already receives events in batches, so it can collapse
a whole batch into one notification. That helps, but not enough. Batches in this project arrive **every 10 seconds**
(`KAFKA_MAX_WAIT_TIME_IN_MS`, see `../../lib/api/config/providers/common-kafka.config.ts`), so the user now gets:

```text
12:00:00   "You have 10 new subscribers"
12:00:10   "You have 4 new subscribers"
12:00:20   "You have 9 new subscribers"
```

Still a stream, just a slower one.

Batching cannot fix this, and the reason is worth saying plainly: **batching groups events that arrive together, and
the problem is events that keep arriving over time.** No batch size solves that, because there is always a next batch.

## Part 2 — There are two kinds of notification

Everything gets easier once notifications stop being treated as all the same.

**Aggregatable.** Individually almost worthless, valuable in bulk.

**Individual.** Each one is a distinct thing the person might act on.

A quick test: *if ten of these happened, would you want ten rows, or one row saying ten?* Ten replies deserve ten rows —
each is a different conversation. Ten subscribers deserve one row.

This project has four notification types:

| Type                      | Kind         |
|---------------------------|--------------|
| New subscribers           | aggregatable |
| New comments on my videos | aggregatable |
| Replies to my comments    | individual   |
| Mentions                  | individual   |

Only the aggregatable kind has the stream problem, and Parts 3 to 9 apply only to them.

## Part 3 — Update one row instead of adding rows

Keep **one open notification per thing being counted**, and change it as events arrive rather than inserting new ones.

Step by step, with subscribers:

1. First subscriber arrives. No open notification exists, so one is created with *count = 1*.
2. Second subscriber. An open notification exists → *count = 2*.
3. Third, fourth, twenty-third → same row, *count = 23*.
4. The user opens the app and sees **one** line: "23 people have subscribed to your channel recently".

Nothing is ever sent twice, because nothing is being sent — the row simply holds the current number, and the user reads
it whenever they happen to look. There is no timing problem left to solve.

## Part 4 — What "one per thing being counted" means

The grouping key decides how useful the result is.

* **New subscribers** → one open notification per channel. "23 new subscribers" is a complete thought.
* **New comments on my videos** → one per video. "23 new comments on *How to cook pasta*" tells the person where to
  look;
  "23 new comments" does not.

The rule: **the key is whatever the notification is about.** If it concerns a specific video, the video belongs in the
key.

What counts as a new comment matters just as much: **top-level comments only.** A reply notifies the author of the
comment it answers, and nobody else. Counting replies here would fill the aggregate with other people's conversations
on a busy video, and would notify the video owner twice about a reply to their own comment — once as a reply, once as a
new comment.

## Part 5 — Making the database enforce "only one open notification"

The obvious implementation is: look for an open notification, update it if found, otherwise insert one. That has a
race. Two events in the same batch — or two worker instances — both look, both find nothing, and both insert. Now there
are two open notifications for the same thing, and the user sees exactly the duplication this was meant to prevent.

Let Postgres enforce it instead, with a **partial unique index**:

```sql
CREATE UNIQUE INDEX notifications_one_open_per_key
    ON notifications (channel_id, type, subject_id) NULLS NOT DISTINCT
    WHERE read_at IS NULL;
```

"Partial" means the index only covers rows matching the `WHERE`. So the table can hold any number of *read*
notifications with the same key — that is the user's history — but only ever one **unread** one. The database refuses a
second.

**`NULLS NOT DISTINCT` is not decoration.** New subscribers have no subject — the key is only the channel and the type —
so `subject_id` is `NULL` for them. By default Postgres treats every `NULL` as different from every other `NULL`, which
means a plain unique index would happily accept any number of open subscriber notifications. `NULLS NOT DISTINCT`
(Postgres 15 and later) makes them collide as intended. On older versions, store a non-null placeholder subject instead.

The write then becomes a single upsert:

```sql
INSERT INTO notifications (channel_id, type, subject_id, count, first_event_at, activity_at)
VALUES (...)
ON CONFLICT (channel_id, type, subject_id) WHERE read_at IS NULL
DO UPDATE SET
    count          = notifications.count + EXCLUDED.count,
    first_event_at = LEAST(notifications.first_event_at, EXCLUDED.first_event_at),
    activity_at    = GREATEST(notifications.activity_at, EXCLUDED.activity_at);
```

`first_event_at` and `activity_at` are explained in Parts 8 and 9.

One Postgres detail that costs an hour if unknown: when the unique index is partial, `ON CONFLICT` has to repeat the
index's `WHERE` clause, exactly as above. Without it Postgres cannot tell which index is meant, and the statement fails.

## Part 6 — Closing, and what "new" means

When the user reads the notification — or hides it, which also marks it read — set `read_at`.

That row immediately falls out of the partial index, because the index only covers rows where `read_at IS NULL`. So the
next subscriber finds no open notification and creates a fresh one, starting at 1.

This is what makes the number mean **"new since you last looked"** rather than "total ever". A counter that never
resets stops being a notification and becomes a statistic.

## Part 7 — What the text shows

**Individual notifications name the person.** "UserName replied to your comment" — the name is the point.

**Aggregated notifications do not.** "47 people have subscribed to your channel recently" — just a count, in the
singular or the plural as needed. That also means an aggregated notification stores no list of who was counted.

## Part 8 — The time shown, and the order of the list

Every notification shows when it happened, and the list is ordered by it. Which time that is depends on the kind:

* **Individual** — when it was created. It never changes afterwards.
* **Aggregated** — when it last *gained* something. An aggregate opened at 9am and still climbing at 5pm is the most
  relevant thing the user has; sorted by creation time it would sit at the bottom under everything newer.

Rather than making the client work out which timestamp applies, keep **one field** — `activity_at` — and compute it on
the server. The client displays that field and sorts by it, and never knows there were two cases.

The trap that goes with it: **`activity_at` changes only on new activity.** Reading, hiding and counting down must
leave it alone. Otherwise opening an old notification, or somebody unsubscribing, moves it to the top of the list. A
generic "last modified" column maintained by the ORM or by a trigger is exactly the wrong thing to use here — it changes
on every write, which is precisely what this field must not do.

Use **event times**, not the moment the worker processed the batch, for both `activity_at` and `first_event_at`. The
worker runs up to a batch behind.

## Part 9 — Counting down

Counts also go down: a subscriber unsubscribes, a comment is deleted. The obvious rule — "lower the count, delete the
notification at zero" — is almost right, and the part that is wrong is subtle.

### The bug

1. Yesterday Alice subscribed. She was counted in a notification the user has since **read**.
2. Today a new notification opens and counts three new subscribers.
3. Alice unsubscribes.
4. The naive rule lowers today's notification to 2.

But Alice was never in today's notification. Its count is now wrong, and nothing will ever correct it.

### The fix

The notification needs to know whether a removed item was one of the things it counted. That does not require storing
who was counted:

1. The notification keeps `first_event_at` — the event time of the first item it counted (Part 5's upsert maintains it).
2. The removal event carries **when the subscription or comment was originally created**.
3. The worker lowers the open notification only if that creation time is **not earlier** than `first_event_at`.

Alice's subscription was created yesterday, before today's notification's first event, so she is skipped — correctly.

```sql
UPDATE notifications
SET count = count - 1
WHERE channel_id = $1
  AND type = $2
  AND subject_id IS NOT DISTINCT FROM $3
  AND read_at IS NULL
  AND first_event_at <= $removed_item_created_at;

DELETE FROM notifications
WHERE channel_id = $1
  AND type = $2
  AND subject_id IS NOT DISTINCT FROM $3
  AND read_at IS NULL
  AND count <= 0;
```

In a batch, count how many removed items pass the check and subtract that number at once. Note that decrementing does
not touch `activity_at` (Part 8).

### Why both times must be event times

If `first_event_at` were the moment the worker processed the batch, it would always be a little *later* than the
subscription that opened the notification. Then removing that very first subscriber would fail the check and never be
subtracted. Comparing event time to event time avoids it.

### What is not counted down

* **Individual notifications stay** when their comment is deleted. An email about it may already be sitting in the
  inbox, and removing only the in-app copy would make the two disagree.
* **Deleting the subject deletes the notification.** When a video is deleted, its new comments notification goes with
  it, whatever its count.

### A race that resolves itself

If the user reads a notification at the same moment a batch is being written, the insert simply stops conflicting — the
read row has left the index — so a new notification is created for the new events. And a decrement that arrives just
after reading finds no open notification and does nothing, leaving the read one untouched. Both are exactly right, and
neither needs special handling.

## Part 10 — Email is a different problem

Everything above works because an unread notification is **mutable** — it keeps changing until the user looks at it.
An email cannot be taken back once it is sent.

That is why, in this project, **the aggregatable types are never emailed.** Only replies and mentions can be, and only
when the channel has turned that on.

Individual types still have a flooding risk of their own: a busy thread can produce thirty replies in an hour. Those
are gathered with a time window per thread — a leading-edge send plus a trailing flush:

1. The first reply or mention in a thread is emailed **immediately**. It also opens a 15-minute window for that thread
   and schedules a flush job for the end of it.
2. Further replies and mentions in that thread during the window **only accumulate** — no email, no new job.
3. The flush fires. If anything accumulated, it sends **one** email covering all of it, then closes the window.

BullMQ delayed jobs already do this kind of work in the project for video processing, and they fit exactly.

Two details:

* **Check preferences again at flush time.** The user may have turned email off while events were waiting.
* **Drop deleted comments at flush time.** A reply deleted while it waited is left out, and if nothing is left, no email
  is sent.

## Part 11 — Which type gets what

| Type                      | In-app                                                   | Email                                                      |
|---------------------------|----------------------------------------------------------|------------------------------------------------------------|
| New subscribers           | one open notification per channel                        | never                                                      |
| New comments on my videos | one open notification per video, top-level comments only | never                                                      |
| Replies to my comments    | one notification each                                    | first immediately, then gathered per thread for 15 minutes |
| Mentions                  | one notification each                                    | first immediately, then gathered per thread for 15 minutes |

By default every in-app type is on and every email type is off. A channel with no stored preferences simply uses those
defaults, so creating a channel writes nothing.

New videos from subscriptions and likes on videos are not notification types for now.

## Part 12 — How this fits the workers that already exist

The shape is the same as the count workers: consume a Kafka batch, group events in memory by key, then one statement
per group. The difference is only in the statement — an upsert against a partial unique index, or a conditional
decrement, instead of a plain delta update.

That also means it inherits the same requirement: **every write has to be idempotent.** If a batch is redelivered —
which Kafka will do — nothing may be counted twice, in either direction. Use the inbox approach from
[kafka-dedup-and-inbox-pattern.md](kafka-dedup-and-inbox-pattern.md).

Do not build this worker on the current `BaseCountWorkerService` deduplication. It reserves event ids before writing,
which can lose events — see [known-issues.md](../known-issues.md).

The grouping key starting with the channel id is also why notification preferences are per channel rather than per
account: the preference lookup, the grouping key and the notification row all share their first column.

## Part 13 — Things to get right

* **`ON CONFLICT` must repeat the partial index's `WHERE` clause.** Otherwise Postgres cannot match the index.
* **The unique index needs `NULLS NOT DISTINCT`**, or open subscriber notifications — which have no subject — never
  collide.
* **`activity_at` changes only on new activity**, never on read, hide or decrement.
* **Count down only what was counted**, by comparing event times.
* **Check preferences before writing**, not when rendering — and again when an email flush runs.
* **Never notify a channel about its own action.** A reply from another channel of the same account still notifies.
* **Delete an aggregated notification when its subject goes.**
* **The unread badge counts rows, not events** — "3 notifications", not "47 things happened". In this project it is
  loaded with the page, not polled, and the user's own actions update it immediately.
* **Escape user content in emails.** Comment text is user input.
* **If a live push is ever added**, throttle the push, not the data: a busy channel changes its open notification on
  every batch, and pushing every change is a storm even though the data is fine.
