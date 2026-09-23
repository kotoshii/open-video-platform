## Give Kafka a listener for apps on the host

Needs: [Task-01 — Split the Compose setup into per-environment files](Task-01-Split-the-Compose-setup-into-per-environment-files.md)

Give Kafka two listeners: an internal one that advertises `kafka` to containers, and an external one on another port
that advertises `localhost` to apps running on the host in development.

Why: Kafka tells every client which address to use from then on, and no single address works both inside Docker and
on the host ([environments-explained.md](../../../../explainers/environments-explained.md), Part 6).
