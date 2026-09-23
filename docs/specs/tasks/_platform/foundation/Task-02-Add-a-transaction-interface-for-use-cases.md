## Add a transaction interface for use cases

Add a way for a use case to run several repository calls in one database transaction without importing Kysely. The
interface and its injection token live in `lib`; the Kysely implementation opens `db.transaction()`, and the
repositories pick the transaction up instead of the plain connection.

`@nestjs-cls/transactional` with its Kysely adapter does this through `AsyncLocalStorage` — check it before writing one
of your own.

Why: the outbox only works if the data change and the outbox row are written in one transaction
([kafka-dedup-and-inbox-pattern.md](../../../../explainers/kafka-dedup-and-inbox-pattern.md), Part 9). The use case is
where that decision is made, and the layering rule says use cases never import Kysely.
