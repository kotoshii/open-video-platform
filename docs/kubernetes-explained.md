# Kubernetes, explained

What Kubernetes is, what it would change compared with the Docker Compose setup, how the pieces of this project map
onto it, and when it is worth doing.

Related: [environments-explained.md](./environments-explained.md), [infrastructure.md](./infrastructure.md).

---

## Part 1 — What problem it solves

Docker Compose runs containers on **one machine**. It is excellent at that, and it is what this project uses for
production, preview and development.

What Compose cannot do is spread containers across several machines and look after them there. If the machine stops,
everything stops. If `video-api` needs five copies because it is busy, those five copies still share one machine's CPU.

Kubernetes is a system that runs containers on a **group of machines** — a cluster — and keeps them in the state you
asked for. You describe what should be running ("three copies of `video-api`, each with this configuration"), and
Kubernetes makes it so and keeps it so: it restarts crashed containers, moves them off a machine that died, and replaces
old versions with new ones gradually.

The key shift is from **commands** to **desired state**. With Compose you say "start this". With Kubernetes you say "this
is how things should be", and a control loop keeps correcting reality until it matches.

## Part 2 — The core pieces, mapped to what already exists

| Kubernetes | What it is | Closest Compose equivalent |
|---|---|---|
| **Pod** | One or more containers that run together and share a network address. Usually one container. | A single running container |
| **Deployment** | "Keep N identical pods of this image running", with rolling updates. | A service with `replicas`, plus restart policy |
| **Service** | A stable name and address in front of a changing set of pods, with load balancing. | The service name on the Compose network |
| **Ingress** | Routes outside HTTP traffic to Services by host and path. | The nginx gateway |
| **ConfigMap / Secret** | Configuration and secrets injected into pods. | `environment:` and `.env` |
| **PersistentVolume** | Storage that outlives a pod. | A named volume |
| **StatefulSet** | Like a Deployment, but each pod has a stable identity and its own storage. | A database service with its own volume |
| **Job** | Runs a pod to completion once. | An init container that exits |
| **Namespace** | A named group of resources inside one cluster. | A separate Compose project |

## Part 3 — What it would give this project

* **Surviving a machine failure.** Pods are rescheduled onto healthy machines.
* **Scaling a single service.** Run more `video-api` or `comment-rate-count-worker` pods without touching the others —
  and, with autoscaling, let load decide how many.
* **Rolling deployments.** New versions replace old pods a few at a time; a broken version stops rolling out instead of
  taking everything down.
* **Self-healing.** A pod that stops answering its health check is restarted automatically.

Several things built into this project's design become directly useful at that point: the Redis pub/sub for upload
progress exists precisely because there are several instances
([sse-progress-and-redis-pubsub.md](./sse-progress-and-redis-pubsub.md)), and Kafka consumer groups spread partitions
across however many worker pods are running.

## Part 4 — What changes compared with Compose

**Readiness replaces `depends_on`.** Kubernetes has no start-up ordering. Every pod gets probes instead:

* a **readiness probe** — "may this pod receive traffic yet?";
* a **liveness probe** — "is this pod still alive, or should it be restarted?".

A service that cannot reach Postgres yet simply is not ready, and receives no traffic until it is. Migrations and topic
creation become **Jobs**, or init containers inside the pod that needs them. The healthchecks and init containers from
the Compose setup translate almost one to one.

**Configuration moves into ConfigMaps and Secrets.** Because every service is already configured only through
environment variables, with the same names in every environment, nothing in the code changes.

**The gateway becomes an Ingress** — often still nginx, as an Ingress controller.

**Environments become namespaces or clusters.** Preview and production can be two namespaces in one cluster, or two
clusters. Tools such as Helm or Kustomize take the place of the separate Compose files: one base description, with small
per-environment overlays.

## Part 5 — The hard part: stateful services

Stateless services — the APIs, the workers, the UI — are exactly what Kubernetes is best at. Pods come and go and
nothing is lost.

Postgres, Kafka, Redis, MinIO and Keycloak are different. Their data must survive pods moving, and they have their own
rules for replication and failover. Running them well inside Kubernetes is a real specialism. The usual options are:

* **Operators** — software that runs inside the cluster and knows how to operate one particular system: CloudNativePG
  for Postgres, Strimzi for Kafka, and similar ones for the others.
* **Managed services** — let a cloud provider run the databases, and run only the stateless services in Kubernetes.

Treating a production database as "just another container" is the most common mistake when moving to Kubernetes.

## Part 6 — Traps worth knowing in advance

* **Kafka's advertised address, again.** The same problem as in development mode: clients inside and outside the
  cluster need addresses that work from where they are. Strimzi handles this with separate listeners.
* **Probes that lie.** A liveness probe that checks the database will restart every pod whenever the database has a
  hiccup — turning a small outage into a large one. Liveness should check only the process itself; dependencies belong
  in readiness.
* **Resource requests and limits.** Without them, the scheduler cannot place pods sensibly and one busy service can
  starve the rest of a machine.
* **Secrets are only encoded, not encrypted,** unless encryption at rest is configured for the cluster.
* **Per-instance state in memory.** Anything kept in a pod's memory — an open SSE connection, a local cache — is gone
  when the pod moves. The design in this project already accounts for it, but every new feature has to as well.

## Part 7 — When it is worth doing

Not first. Compose covers everything the project needs while it is being built, and the Compose layout
([environments-explained.md](./environments-explained.md)) is deliberately shaped so that nothing has to be redesigned
to move later: services configured only through environment variables, a database per service, health checks, and
one-off jobs for set-up.

When it does become interesting — as its own learning exercise — a gentle path is:

1. Run a local cluster with **kind** or **k3d**, which run a whole cluster inside Docker on one machine.
2. Move one stateless service, such as `video-api`, with a Deployment, a Service and probes.
3. Move the rest of the stateless services and the gateway as an Ingress.
4. Bring in Helm or Kustomize for the environments.
5. Only then look at operators for the stateful services.
