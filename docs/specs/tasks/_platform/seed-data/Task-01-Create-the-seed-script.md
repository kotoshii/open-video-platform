## Create the seed script

Create a `scripts/seed` workspace and a root `yarn seed` command. The script talks to the platform only through the
gateway's public API, the way the UI does, and uses faker with both the English and the Ukrainian locales for text.

Branch — the stack already has seed data (logging in as the first seed account works):

1. Stop with a message; seeding always runs against a fresh stack.

Why: going through the API is the only way the Keycloak users, the counters that workers maintain from Kafka events, the
search index and Gorse all end up consistent. Rows inserted straight into a database would skip every event.
