## Add Redis and BullMQ builders to lib

Add config builders to `lib/api` for a Redis connection and for BullMQ queues and workers, reading the same environment
variable names in every service. Every key a service writes gets the service name as a prefix — BullMQ's `prefix`
option for queues, a key prefix for everything else.

* BullMQ workers need `maxRetriesPerRequest: null` on their connection.
* Add a separate factory for pub/sub subscriber connections: a subscribed connection can run nothing else
  ([sse-progress-and-redis-pubsub.md](../../../../explainers/sse-progress-and-redis-pubsub.md), Part 8).

Why: services share one Redis in preview and development, and the prefix is what keeps their keys apart
([infrastructure.md](../../../infrastructure.md), rules).
