## Connect every Kafka client with its own user

Needs: [Task-02 — Turn on SCRAM authentication in Kafka](Task-02-Turn-on-SCRAM-authentication-in-Kafka.md)

Add the SASL settings to the Kafka config in `lib` — mechanism `scram-sha-512`, with the username and password read from
the same variable names in every service — and give every API and worker its own user, created by the topic init
container.

Why: with one user per service, a leaked password exposes one service, and permissions per topic can later be added on
top of the same users.
