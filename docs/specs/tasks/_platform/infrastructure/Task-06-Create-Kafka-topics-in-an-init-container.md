## Create Kafka topics in an init container

Needs: [Task-04 — Add healthchecks to the infrastructure containers](Task-04-Add-healthchecks-to-the-infrastructure-containers.md)

Add an init container that creates every topic with an explicit partition count, and turn off automatic topic creation
on the broker. Apps depend on it with `condition: service_completed_successfully`.

A topic belongs to the service that publishes to it, and every new service adds its own topics here.

Why: an auto-created topic gets default settings, and its partition count is the limit on how many instances of a
consumer can do useful work — something decided when the topic is created
([scaling-to-multiple-instances.md](../../../../explainers/scaling-to-multiple-instances.md), Part 3).
