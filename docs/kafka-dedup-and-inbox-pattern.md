# Kafka deduplication and the inbox pattern

Why the count workers deduplicate events, what is broken in how they do it today, what the inbox pattern is, and how to
rebuild the deduplication on top of it.

Related: [known-issues.md](./known-issues.md).

---

## Part 1 — Why deduplication exists at all

Kafka promises **at-least-once** delivery. It does not promise "exactly once".

A worker reads a batch of messages, does something with them, and then tells Kafka "I am done with these" by committing
the offsets. An offset is just a bookmark: "I have processed everything up to here."

If the worker dies *after* doing the work but *before* committing the bookmark, Kafka has no idea the work happened. The
next time the worker starts, it reads from the last bookmark it knows about — and delivers the same messages again.

For the count workers this matters, because their work is `+1` and `-1`. Processing the same "someone liked this
comment" event twice adds two likes for one click. The number is then wrong forever, because nothing ever recalculates
it from scratch.

So every event carries a unique `eventId`, and the worker keeps a note of which ids it has already handled. When an id
shows up again, it is skipped.

## Part 2 — How the current deduplication works

The note-keeping is one Redis command, in `lib/api/kafka/services/kafka-deduplication.service.ts`:

```
SET kafka-event-id:reserved:<eventId> "" EX <ttl> NX
```

Three things are happening there:

* `NX` means **only set this key if it does not already exist**. So the command answers `OK` the first time an id is
  seen, and `null` every time after. That is the whole trick — Redis itself decides who was first.
* `EX <ttl>` makes the key expire after a while, so Redis does not fill up with ids forever.
* The value is an empty string, because only the *existence* of the key matters.

The worker runs this for every event id in the batch (pipelined, so it is one round trip) and keeps only the events
whose id answered `OK`. Those are the ones it has never seen before.

The order of operations, in `lib/workers/counts/services/base-count-worker.service.ts` and the services built on it:

1. **Mark** every event id in the batch as "seen" in Redis.
2. **Add up** the `+1`s and `-1`s for the batch, in memory.
3. **Write** the new counts to Postgres, in one statement.
4. **Tell Kafka** the messages are done (resolve the offsets and commit).

## Part 3 — What goes wrong

Step 1 happens before step 3. The ids are marked as handled **before** the result of handling them is saved.

Now suppose Postgres is briefly unreachable, so step 3 fails. The code logs the error and returns, deliberately skipping
step 4.

Skipping step 4 is correct on its own: Kafka never learns those messages were handled, so it will deliver them again.
That *is* the retry mechanism.

But the retry is now poisoned. When the same batch arrives again:

* Step 1 runs again. Every id is already in Redis, so `NX` fails for all of them.
* The worker concludes "I have handled all of these already" and ends up with an **empty list of events**.
* Nothing is added up. Nothing is written.
* Step 4 runs on that empty list, so **no offsets are resolved**.

Which means Kafka delivers the same batch again. And the same thing happens.

### The two consequences

**Those counts are lost.** The events were marked as handled, but their effect never landed anywhere.

**The partition stops moving.** This is the worse one. Kafka delivers messages in order within a partition, so every
message queued behind that batch waits too. One failed database write does not just lose a few likes — it freezes that
whole stream.

It does eventually unstick itself, because the Redis keys have a TTL. Once they expire the ids are forgotten, the
reservations succeed again, and the batch is finally applied. But that is minutes of a frozen partition, and only if the
worker is still sitting there when it happens.

### The root cause in one sentence

"I have handled this event" is recorded in **Redis**, while the result of handling it is recorded in **Postgres**, and
there is no way to take the first one back when the second one fails.

## Part 4 — Two smaller problems in the same code

Worth fixing at the same time, because they cause the same "stuck partition" symptom.

**Offsets are only resolved for events that survived deduplication.** `resolveOffsets` loops over the *deduplicated*
list. A batch where every message is a genuine duplicate — exactly what happens after a crash between the database write
and the offset commit — resolves nothing, so it is delivered again forever. Skipping a message is still *handling* it,
and its offset has to be resolved.

**Messages that fail to parse are dropped silently.** `deduplicateEvents` filters out any message whose body is not
valid JSON. Those never reach `resolveOffsets` either, so a single malformed message blocks the partition permanently.

## Part 5 — What the inbox pattern is

The problem in Part 3 is not really about Redis. It is about **writing two facts to two different systems when you need
both or neither**.

The inbox pattern removes the second system. Instead of remembering "I handled event X" somewhere else, the consumer
records it **in its own database, in the same transaction as the change that event causes**.

A database transaction is all-or-nothing. So if both facts are written inside one:

```sql
BEGIN;
  -- fact 1: I have handled this event
  INSERT INTO processed_events (consumer, event_id) VALUES ('comment-rate-count-worker', '...');
  -- fact 2: the result of handling it
  UPDATE comments SET likes = likes + 1 WHERE id = '...';
COMMIT;
```

then either both happen or neither does. The failure from Part 3 becomes impossible: if the `UPDATE` fails, the `INSERT`
is rolled back with it, the event is not marked as handled, and the retry processes it normally.

Duplicates are caught by a unique constraint on the event id: a second attempt to insert the same id does nothing, and
the update is skipped along with it.

That is the whole pattern. The table is called an "inbox" because it is a record of the messages this service has taken
in.

### How it relates to the outbox pattern

They are mirror images, and it helps to see them together:

* **Outbox** — the *publishing* side. When a service changes its data and needs to tell others, it writes the event into
  an `outbox` table in the same transaction as the change. A separate relay reads that table and publishes to Kafka.
  This guarantees you never change data without publishing the event, and never publish an event for a change that
  rolled back.
* **Inbox** — the *consuming* side, described above. It guarantees you never mark a message as handled without its
  effect landing, and never apply an effect twice.

Both exist for the same reason: a database transaction cannot span a database and a message broker.

### What it does and does not give you

It gives **effectively-once processing**: a message may still be *delivered* many times, but its effect is applied
exactly once.

It does not make Kafka exactly-once, and it does not remove the need for offsets. It only makes the consumer's own
bookkeeping trustworthy.

### When you do not need it

If the operation is naturally **idempotent** — doing it twice gives the same result as doing it once — none of this is
needed. `SET status = 'published'` is idempotent. `SET likes = 42` is idempotent. `likes = likes + 1` is not, which is
precisely why the count workers need protection.

## Part 6 — Step-by-step fix

### Step 1 — Add the inbox table to each database the workers write to

The table has to live in the **same database as the rows being updated**, otherwise there is no shared transaction and
nothing is gained. Each count worker has its own `db/` folder with dbmate migrations pointing at the database it writes
to, so the migration goes there.

```sql
-- migrate:up
create table processed_events (
    consumer     text        not null,
    event_id     uuid        not null,
    processed_at timestamptz not null default now(),
    primary key (consumer, event_id)
);

create index processed_events_processed_at_idx on processed_events (processed_at);

-- migrate:down
drop table processed_events;
```

Two details that matter:

* The primary key is **(consumer, event_id), not event_id alone**. If two workers ever consume the same topic and share
  a database, a single-column key would let the first worker's insert make the second worker skip the event entirely.
  Naming the consumer keeps their bookkeeping separate.
* The index on `processed_at` exists only so the cleanup in Step 5 stays cheap.

### Step 2 — Move deduplication inside the transaction

Today the flow is: deduplicate in Redis, compute deltas, write counts. It becomes: open a transaction, insert the event
ids, keep only the ones actually inserted, compute deltas from those, write counts, commit.

In the repository, one statement both records and filters:

```ts
const inserted = await trx
    .insertInto("processed_events")
    .values(eventIds.map((eventId) => ({ consumer, event_id: eventId })))
    .onConflict((oc) => oc.columns(["consumer", "event_id"]).doNothing())
    .returning("event_id")
    .execute();
```

`ON CONFLICT DO NOTHING` turns a repeated id into a no-op instead of an error, and `RETURNING` gives back only the rows
that were really inserted — that is, only the events this worker has not handled before.

### Step 3 — Rewire the worker service

`BaseCountWorkerService.handleEvents` currently calls `deduplicateEvents` and then a separate update. Restructure so one
Kysely transaction wraps both:

```ts
await this.db.transaction().execute(async (trx) => {
    const newIds = await this.inboxRepository.recordEvents(trx, this.consumerName, allEventIds);
    const newEvents = allEvents.filter((e) => newIds.has(e.payload.eventId));

    if (!newEvents.length) return;                    // all duplicates - nothing to apply

    const deltas = this.calculateDeltas(newEvents);   // unchanged from today
    await this.countRepository.applyDeltas(trx, deltas);
});
```

The per-worker `calculateDeltas` logic does not change at all. What changes is *when* an event counts as handled and
*where* that is written down.

### Step 4 — Fix the offset handling

This part must not be skipped, or the partition can still stall.

Resolve the offset of **every message in the batch**, not only the ones newly inserted:

```ts
for (const message of payload.batch.messages) {
    payload.resolveOffset(message.offset);
}
await payload.commitOffsetsIfNecessary();
```

Duplicates were handled — by being deliberately skipped. Unparseable messages were handled too — by being discarded.
Both deserve to have their offsets resolved. Log the unparseable ones so they stay visible, but do not let one bad
message freeze the stream.

Resolve offsets **after** the transaction commits. If it throws, resolve nothing and let Kafka redeliver — that path is
now safe, because nothing was recorded.

### Step 5 — Clean up old inbox rows

The table grows forever otherwise. A periodic delete is enough:

```sql
delete from processed_events where processed_at < now() - interval '7 days';
```

The retention window has to be **longer than the longest realistic redelivery gap** — comfortably longer than Kafka's
own topic retention, since a consumer group reset can replay old messages. A week is a safe starting point; a day would
work too, but leaves less margin.

### Step 6 — Decide what to do with Redis

Once the inbox is in place, Redis is no longer needed for correctness here. Two reasonable options:

* **Remove it from this path.** Simplest, one fewer moving part, and the deduplication story becomes "it is in the
  database".
* **Keep it as a fast pre-filter.** Check Redis first and skip obvious repeats without touching Postgres, but treat the
  database as the authority. Only worth it if duplicate volume is actually high.

Start by removing it, and add it back later with measurements in hand.

## Part 7 — What happens in each failure case afterwards

| Failure | What happens |
|---|---|
| Database write fails | Transaction rolls back, ids not recorded, offsets not resolved. Kafka redelivers, batch applies normally. |
| Worker crashes mid-transaction | Same as above — Postgres discards an uncommitted transaction. |
| Crash after commit, before offsets | Kafka redelivers. Inserts conflict, no events are new, nothing is applied, offsets resolve. No double counting. |
| Batch is entirely duplicates | Nothing applied, offsets resolved, stream moves on. |
| One message is malformed | Logged and skipped, its offset resolved, the rest of the batch processes. |

Every row ends with the stream moving forward. That is the property the current code is missing.

## Part 8 — Operational notes

* `partitionsConsumedConcurrently: 1` processes partitions one at a time. Correct, but it caps throughput; raise it only
  once the inbox makes concurrent processing safe to reason about.
* `heartbeat()` is called once at the end of a batch. With large batches and a slow database, the consumer can be
  considered dead and dropped from the group mid-batch. If batches grow, heartbeat during processing as well.
* `greatest(0, ...)` in the count update silently absorbs decrements that arrive when a count is already `0`. It
  prevents negative numbers, but it also hides drift — worth remembering when a count looks wrong.
