## Turn on SCRAM authentication in Kafka

Needs: [infrastructure Task-06 — Create Kafka topics in an init container](../infrastructure/Task-06-Create-Kafka-topics-in-an-init-container.md)

Upgrade Kafka to a current release and make every client log in with SASL/SCRAM-SHA-512, on both listeners.

* Create the admin user when Kafka formats its storage (`kafka-storage format --add-scram ...`). The broker needs it
  before it starts; check how the chosen image lets you pass that flag, and wrap its start command if it doesn't.
* Have the topic init container log in as the admin and create one user per service, plus one each for Kafka UI and
  Alloy, with `kafka-configs --add-config 'SCRAM-SHA-512=[password=...]'`. Passwords come from the environment.
* Kafka 4.0 dropped old protocol versions, and `kafkajs` hasn't had a release in a long time: check that it works with
  4.x, and stay on 3.9 — the last 3.x, which has SCRAM too — if it doesn't.

Why: with SCRAM the password never travels to the broker — the client proves it knows it — and users live in the
cluster, so one can be added or changed without editing a config file and restarting Kafka.
