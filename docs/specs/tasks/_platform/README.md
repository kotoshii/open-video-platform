# Platform tasks — the order to do them in

The tasks here belong to no story. This file says when each one is done, relative to the stories in the
[work plan](../../../project-overview.md#work-plan). Inside each area the numbers follow the same order.

Most of the groundwork comes before the first story, since every migrated or new service is built on it. Tasks that
only one feature needs wait until just before that feature's story.

## 1. Groundwork — before any story

Repository:

* [ci Task-01 — Pin the Node version](ci/Task-01-Pin-the-Node-version.md)
* [ci Task-02 — Add lint, typecheck and test scripts](ci/Task-02-Add-lint-typecheck-and-test-scripts.md)
* [ci Task-03 — Set up Jest for the Nest apps](ci/Task-03-Set-up-Jest-for-the-Nest-apps.md)

Local environment:

* [infrastructure Task-01 — Split the Compose setup into per-environment files](infrastructure/Task-01-Split-the-Compose-setup-into-per-environment-files.md)
* [known-issues Task-01 — Delete the infra folder](known-issues/Task-01-Delete-the-infra-folder.md)
* [infrastructure Task-02 — Add environment files and shared secrets](infrastructure/Task-02-Add-environment-files-and-shared-secrets.md)
* [infrastructure Task-03 — Create a database and user per service](infrastructure/Task-03-Create-a-database-and-user-per-service.md)
* [infrastructure Task-04 — Add healthchecks to the infrastructure containers](infrastructure/Task-04-Add-healthchecks-to-the-infrastructure-containers.md)
* [infrastructure Task-05 — Run database migrations in init containers](infrastructure/Task-05-Run-database-migrations-in-init-containers.md)
* [infrastructure Task-06 — Create Kafka topics in an init container](infrastructure/Task-06-Create-Kafka-topics-in-an-init-container.md)
* [infrastructure Task-07 — Create MinIO buckets and lifecycle rules](infrastructure/Task-07-Create-MinIO-buckets-and-lifecycle-rules.md)
* [infrastructure Task-08 — Set an explicit size for every connection pool](infrastructure/Task-08-Set-an-explicit-size-for-every-connection-pool.md)
* [infrastructure Task-09 — Give Kafka a listener for apps on the host](infrastructure/Task-09-Give-Kafka-a-listener-for-apps-on-the-host.md)
* [infrastructure Task-10 — Run tusd behind the gateway](infrastructure/Task-10-Run-tusd-behind-the-gateway.md)
* [infrastructure Task-11 — Serve the buckets through nginx-s3-gateway](infrastructure/Task-11-Serve-the-buckets-through-nginx-s3-gateway.md)
* [infrastructure Task-12 — Set the presign host per environment](infrastructure/Task-12-Set-the-presign-host-per-environment.md)
* [infrastructure Task-13 — Let containers reach apps running on the host](infrastructure/Task-13-Let-containers-reach-apps-running-on-the-host.md)
* [infrastructure Task-14 — Start every app with one command](infrastructure/Task-14-Start-every-app-with-one-command.md)

Service-to-service security:

* [security Task-01 — Authenticate gRPC calls with API keys](security/Task-01-Authenticate-gRPC-calls-with-API-keys.md)
* [security Task-02 — Turn on SCRAM authentication in Kafka](security/Task-02-Turn-on-SCRAM-authentication-in-Kafka.md)
* [security Task-03 — Connect every Kafka client with its own user](security/Task-03-Connect-every-Kafka-client-with-its-own-user.md)

Identity at the gateway:

* [infrastructure Task-15 — Run Keycloak with an imported realm](infrastructure/Task-15-Run-Keycloak-with-an-imported-realm.md)
* [infrastructure Task-16 — Spike: Verify Keycloak tokens in the nginx gateway](infrastructure/Task-16-Spike-Verify-Keycloak-tokens-in-the-nginx-gateway.md)
* [infrastructure Task-17 — Verify access tokens in the gateway](infrastructure/Task-17-Verify-access-tokens-in-the-gateway.md)

Shared code in `lib`:

* [foundation Task-01 — Read the gateway identity headers in lib](foundation/Task-01-Read-the-gateway-identity-headers-in-lib.md)
* [foundation Task-02 — Add a transaction interface for use cases](foundation/Task-02-Add-a-transaction-interface-for-use-cases.md)
* [foundation Task-03 — Define the API error codes in lib](foundation/Task-03-Define-the-API-error-codes-in-lib.md)
* [foundation Task-04 — Return error codes from every API](foundation/Task-04-Return-error-codes-from-every-API.md)
* [foundation Task-05 — Define the supported languages in lib](foundation/Task-05-Define-the-supported-languages-in-lib.md)
* [foundation Task-06 — Add Redis and BullMQ builders to lib](foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)
* [foundation Task-07 — Add an S3 client builder to lib](foundation/Task-07-Add-an-S3-client-builder-to-lib.md)
* [foundation Task-08 — Add the event time to the base Kafka event](foundation/Task-08-Add-the-event-time-to-the-base-Kafka-event.md)
* [foundation Task-09 — Add the Kafka inbox to lib](foundation/Task-09-Add-the-Kafka-inbox-to-lib.md)
* [foundation Task-10 — Add the transactional outbox to lib](foundation/Task-10-Add-the-transactional-outbox-to-lib.md)
* [foundation Task-11 — Add the outbox relay to lib](foundation/Task-11-Add-the-outbox-relay-to-lib.md)
* [known-issues Task-02 — Rebuild the count worker base on the inbox](known-issues/Task-02-Rebuild-the-count-worker-base-on-the-inbox.md)
* [known-issues Task-03 — Resolve offsets for skipped and malformed messages](known-issues/Task-03-Resolve-offsets-for-skipped-and-malformed-messages.md)

Frontend:

* [frontend Task-01 — Create the Next.js app](frontend/Task-01-Create-the-Nextjs-app.md)
* [frontend Task-02 — Set up the route groups](frontend/Task-02-Set-up-the-route-groups.md)
* [frontend Task-03 — Create the API client](frontend/Task-03-Create-the-API-client.md)
* [ci Task-04 — Set up Vitest for the UI](ci/Task-04-Set-up-Vitest-for-the-UI.md)
* [ci Task-05 — Add the checks workflow](ci/Task-05-Add-the-checks-workflow.md)

The apps in Docker:

* [infrastructure Task-18 — Build every Nest app from one Dockerfile](infrastructure/Task-18-Build-every-Nest-app-from-one-Dockerfile.md)
* [infrastructure Task-19 — Build the UI image from the standalone output](infrastructure/Task-19-Build-the-UI-image-from-the-standalone-output.md)
* [infrastructure Task-20 — Add the apps to Compose](infrastructure/Task-20-Add-the-apps-to-Compose.md)
* [infrastructure Task-21 — Add a health endpoint to every API and worker](infrastructure/Task-21-Add-a-health-endpoint-to-every-API-and-worker.md)
* [infrastructure Task-22 — Resolve gateway upstreams on every request](infrastructure/Task-22-Resolve-gateway-upstreams-on-every-request.md)
* [docs Task-01 — Make Swagger match the gateway](docs/Task-01-Make-Swagger-match-the-gateway.md)
* [docs Task-02 — Serve every API's docs from one page](docs/Task-02-Serve-every-APIs-docs-from-one-page.md)

## 2. Logs and monitoring — the first item of Preparation

Before the Preparation stories, as the work plan lists it — and before any service is migrated, so every migration
starts with the logger and the tracing already in place.

* [observability Task-01 — Run otel-lgtm and send a first log and span](observability/Task-01-Run-otel-lgtm-and-send-a-first-log-and-span.md)
* [observability Task-02 — Add a JSON logger to lib](observability/Task-02-Add-a-JSON-logger-to-lib.md)
* [observability Task-03 — Ship container logs to Loki with Alloy](observability/Task-03-Ship-container-logs-to-Loki-with-Alloy.md)
* [observability Task-04 — Create the tracing bootstrap in lib](observability/Task-04-Create-the-tracing-bootstrap-in-lib.md)
* [observability Task-05 — Add trace ids to every log line](observability/Task-05-Add-trace-ids-to-every-log-line.md)
* [observability Task-06 — Check that the gateway passes traceparent through](observability/Task-06-Check-that-the-gateway-passes-traceparent-through.md)
* [observability Task-07 — Carry trace context through the outbox and Kafka](observability/Task-07-Carry-trace-context-through-the-outbox-and-Kafka.md)
* [observability Task-08 — Link batch spans to the traces of their messages](observability/Task-08-Link-batch-spans-to-the-traces-of-their-messages.md)
* [observability Task-09 — Link traces and logs in Grafana](observability/Task-09-Link-traces-and-logs-in-Grafana.md)
* [observability Task-10 — Spike: Can ngx_otel_module run in the gateway image](observability/Task-10-Spike-Can-ngx_otel_module-run-in-the-gateway-image.md)
* [observability Task-11 — Add gateway spans with ngx_otel_module](observability/Task-11-Add-gateway-spans-with-ngx_otel_module.md)
* [observability Task-12 — Add HTTP metrics per service and route](observability/Task-12-Add-HTTP-metrics-per-service-and-route.md)
* [observability Task-13 — Add count worker metrics](observability/Task-13-Add-count-worker-metrics.md)
* [observability Task-14 — Collect Kafka consumer lag with Alloy](observability/Task-14-Collect-Kafka-consumer-lag-with-Alloy.md)
* [observability Task-15 — Collect Postgres and Redis metrics](observability/Task-15-Collect-Postgres-and-Redis-metrics.md)
* [observability Task-16 — Collect Nginx, MinIO and Keycloak metrics](observability/Task-16-Collect-Nginx-MinIO-and-Keycloak-metrics.md)
* [observability Task-17 — Provision dashboards and add the Services dashboard](observability/Task-17-Provision-dashboards-and-add-the-Services-dashboard.md)
* [observability Task-18 — Add the Kafka workers dashboard](observability/Task-18-Add-the-Kafka-workers-dashboard.md)
* [observability Task-19 — Add the infrastructure dashboard](observability/Task-19-Add-the-infrastructure-dashboard.md)

## 3. Alongside the stories

These wait for the story named next to them.

| When | Task |
|------|------|
| After I18n-01 | [docs Task-03 — Write the UI README](docs/Task-03-Write-the-UI-README.md) |
| Right after each service's migrate or create task | its README — [docs Task-04](docs/Task-04-Write-the-account-api-README.md) to [Task-25](docs/Task-25-Write-the-notification-worker-README.md), numbered in the order the services are opened |
| Before Auth-02 (MVP 2) | [infrastructure Task-23 — Create email-worker](infrastructure/Task-23-Create-email-worker.md) |
| Before Auth-02 (MVP 2) | [infrastructure Task-24 — Look up the address and language when sending](infrastructure/Task-24-Look-up-the-address-and-language-when-sending.md) |
| Before Auth-02 (MVP 2) | [infrastructure Task-25 — Render emails from Handlebars templates](infrastructure/Task-25-Render-emails-from-Handlebars-templates.md) |
| Before Auth-02 (MVP 2) | [infrastructure Task-26 — Add a mail catcher to Compose](infrastructure/Task-26-Add-a-mail-catcher-to-Compose.md) |
| With Auth-04 (MVP 3) | [frontend Task-04 — Add single-flight token refresh to the API client](frontend/Task-04-Add-single-flight-token-refresh-to-the-API-client.md) |
| After Videos-05 (MVP 13) | [observability Task-20 — Add video pipeline metrics](observability/Task-20-Add-video-pipeline-metrics.md) |
| After Videos-05 (MVP 13) | [observability Task-21 — Add the video pipeline dashboard](observability/Task-21-Add-the-video-pipeline-dashboard.md) |
| After Videos-05 (MVP 13) | [seed-data Task-01](seed-data/Task-01-Create-the-seed-script.md) to [Task-04 — Upload and publish the seed videos](seed-data/Task-04-Upload-and-publish-the-seed-videos.md) |
| With Videos-01 (MVP 16), right after migrating `video-view-count-worker` | [known-issues Task-04 — Add the video id to the view dedup key](known-issues/Task-04-Add-the-video-id-to-the-view-dedup-key.md) |
| After Videos-01 (MVP 16) | [ci Task-06 — Add the CI environment file](ci/Task-06-Add-the-CI-environment-file.md) |
| After Videos-01 (MVP 16) | [ci Task-07 — Write the smoke test script](ci/Task-07-Write-the-smoke-test-script.md) |
| After Videos-01 (MVP 16) | [ci Task-08 — Add the preview smoke test workflow](ci/Task-08-Add-the-preview-smoke-test-workflow.md) |
| After Comments-04 (MVP 22) | [seed-data Task-05 — Seed comments and replies](seed-data/Task-05-Seed-comments-and-replies.md) |
| Before Search-01 (MVP 25) | [infrastructure Task-27 — Run Elasticsearch with the Ukrainian analysis plugin](infrastructure/Task-27-Run-Elasticsearch-with-the-Ukrainian-analysis-plugin.md) |
| After Subscriptions-01 (MVP 28) | [seed-data Task-06 — Seed rates, subscriptions and views](seed-data/Task-06-Seed-rates-subscriptions-and-views.md) |

## 4. After the MVP

Alerts need a sense of what normal looks like, and splitting the observability stack is easier once everything it
watches exists.

* [observability Task-22 — Alert on consumer lag and failed batches](observability/Task-22-Alert-on-consumer-lag-and-failed-batches.md)
* [observability Task-23 — Alert on errors, failed jobs and disk usage](observability/Task-23-Alert-on-errors-failed-jobs-and-disk-usage.md)
* [observability Task-24 — Run Loki, Tempo and Prometheus as separate containers](observability/Task-24-Run-Loki-Tempo-and-Prometheus-as-separate-containers.md)
* [observability Task-25 — Replace otel-lgtm with Alloy and Grafana](observability/Task-25-Replace-otel-lgtm-with-Alloy-and-Grafana.md)
* [observability Task-26 — Set retention for traces, logs and metrics](observability/Task-26-Set-retention-for-traces-logs-and-metrics.md)
* [docs Task-26 — Write the root README for preview and production](docs/Task-26-Write-the-root-README-for-preview-and-production.md)
* [docs Task-27 — Write the root README for development](docs/Task-27-Write-the-root-README-for-development.md)
* [infrastructure Task-28 — Spike: Can several tusd instances share uploads](infrastructure/Task-28-Spike-Can-several-tusd-instances-share-uploads.md)

## 5. Once the stack runs unattended

* [observability Task-27 — Add a push contact point for alerts](observability/Task-27-Add-a-push-contact-point-for-alerts.md)

## Later

No fixed time — whenever they become worth it.

* [observability Task-28 — Later: Trace the Next.js server side](observability/Task-28-Later-Trace-the-Nextjs-server-side.md)
* [observability Task-29 — Later: Monitor the browser with Grafana Faro](observability/Task-29-Later-Monitor-the-browser-with-Grafana-Faro.md)
* [observability Task-30 — Later: Add exemplars to request metrics](observability/Task-30-Later-Add-exemplars-to-request-metrics.md)
* [ci Task-09 — Later: Cache Docker layers in the smoke test](ci/Task-09-Later-Cache-Docker-layers-in-the-smoke-test.md)
* [ci Task-10 — Later: Check only the changed workspaces](ci/Task-10-Later-Check-only-the-changed-workspaces.md)
* [ci Task-11 — Later: Require both workflows before merging](ci/Task-11-Later-Require-both-workflows-before-merging.md)
