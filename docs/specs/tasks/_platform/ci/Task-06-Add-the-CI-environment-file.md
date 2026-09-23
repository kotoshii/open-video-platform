## Add the CI environment file

Needs: [infrastructure Task-02 — Add environment files and shared secrets](../infrastructure/Task-02-Add-environment-files-and-shared-secrets.md)

Add a committed `.env.ci` with dummy credentials and smaller memory limits — `ES_JAVA_OPTS=-Xms512m -Xmx512m` and
`KAFKA_HEAP_OPTS` — and have the Compose files read those as variables with defaults.

Why: the repository is public, so this file must never hold a real secret. Without the limits, Elasticsearch and Kafka
size their heaps from the runner's 16 GB and crowd out everything else.
