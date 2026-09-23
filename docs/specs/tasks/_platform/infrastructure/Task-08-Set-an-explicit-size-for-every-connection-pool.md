## Set an explicit size for every connection pool

Read a pool size from the environment in the Kysely config builder in `lib` and pass it as the pool's `max`. Choose the
size per service, and set Postgres's `max_connections` on purpose rather than leaving the default.

Why: `node-postgres` gives every pool 10 connections, so services × instances × 10 quietly passes Postgres's default of
100, and whichever service starts last is refused
([scaling-to-multiple-instances.md](../../../../explainers/scaling-to-multiple-instances.md), Part 8).
