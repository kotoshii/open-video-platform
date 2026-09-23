## Run Elasticsearch with the Ukrainian analysis plugin

Needs: [Task-04 — Add healthchecks to the infrastructure containers](Task-04-Add-healthchecks-to-the-infrastructure-containers.md)

Build an Elasticsearch image with the `analysis-ukrainian` plugin installed, and add it to `infra.yaml` with a
healthcheck. Read the heap size from a variable with a default (`ES_JAVA_OPTS`), so CI can set a smaller one.

Why: plugins go into the image before the node starts, and a node without this one refuses any index that uses the
`ukrainian` analyzer ([US-Search-01](../../../user-stories/search/US-Search-01-Search-videos.md)). Without a set heap,
Elasticsearch sizes it from the machine's memory.
