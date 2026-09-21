# Continuous integration with GitHub Actions

What runs on every push and every pull request, why there are two separate jobs, what the repository is missing before
either can run, and the traps in running a whole microservice stack on a free CI machine.

Related: [environments-explained.md](environments-explained.md) — the preview environment the second job starts.
[scaling-to-multiple-instances.md](scaling-to-multiple-instances.md) — CI is the cheapest place to run two instances.

---

## Part 1 — What GitHub Actions is, in one minute

A **workflow** is a YAML file in `.github/workflows/`. It says *when* to run (`on:` — a push, a pull request, a
button click) and *what* to run: one or more **jobs**, each a list of **steps** executed on a fresh virtual machine
called a **runner**.

A step is either a shell command (`run:`) or a ready-made **action** from GitHub's marketplace (`uses:`) — for example
`actions/checkout`, which clones the repository onto the runner. Every job starts from an empty machine, so anything a
job needs, it installs or builds itself.

## Part 2 — What this project gets for free

The repository is public, and on public repositories the standard runners are **free and unlimited**. The standard
Linux runner (`ubuntu-latest`) has:

| | Public repository | Private repository |
|---|---|---|
| CPU | 4 cores | 2 cores |
| Memory | 16 GB | 8 GB |
| Disk | 14 GB | 14 GB |
| Minutes | unlimited | from a monthly allowance |

That matters for the second job, which runs the whole platform. A rough memory budget for the preview environment:
Elasticsearch with a capped heap ~1 GB, Keycloak ~0.7 GB, Kafka ~0.7 GB, Postgres, Redis, MinIO, Gorse, nginx and tusd
together ~1 GB, about twenty Node services at ~150 MB each ~3.5 GB, and Next.js ~0.3 GB — **roughly 7–8 GB of the 16**.

It fits. The resource that is actually tight is **disk**, because twenty-odd images add up quickly; Part 6 covers it.
On a private repository, 8 GB would not be enough.

## Part 3 — Two jobs, because they answer two different questions

| Job | Answers | Runs | Takes |
|---|---|---|---|
| **checks** | Is the code well-formed? Lint, types, unit tests | Every push | A few minutes |
| **preview smoke test** | Does the system start and work end to end? | Pull requests, and on demand | 15–30 minutes |

Merging them would make every push wait half an hour for an answer the first job gives in three minutes. Keeping them
apart means fast feedback on every push and the slow, expensive check only where it is worth it.

## Part 4 — What the repository is missing today

Neither job has anything to run yet. Before writing a workflow:

1. **A pinned Node version.** There is no `.nvmrc` and no `engines` field, so CI would use whatever Node the runner
   happens to have. Add a `.nvmrc` at the root with the version used locally; the workflow reads it from there.
2. **Scripts for lint, typecheck and test.** The services only have `build`, `start` and database scripts. Add:
    * at the root, `lint`: `biome ci .` — Biome's `ci` command checks formatting and lint rules without writing
      anything, and fails on the first problem. Biome is already a dependency in every workspace (version 2.1.4);
    * in every workspace, `typecheck`: `tsc --noEmit`, and at the root, `typecheck`:
      `yarn workspaces foreach -At run typecheck`. The `-t` runs workspaces in dependency order, so `proto` and `lib/*`
      are checked before the apps that import them;
    * at the root, `test`: `yarn workspaces foreach -A run test`. Yarn only runs a script in the workspaces that
      define it, so workspaces without tests are skipped rather than failing.
3. **A test runner.** Nothing is installed. Nest scaffolds projects with **Jest**; **Vitest** is lighter and faster to
   start. Either works — pick one for every workspace, so there is one way to run tests.

The repository already commits its Yarn release (`yarnPath` in `.yarnrc.yml`, Yarn 4), so the runner's preinstalled
`yarn` hands over to it and nothing needs installing. If an install step ever behaves like Yarn 1, enable Corepack and
add a `packageManager` field to the root `package.json`.

## Part 5 — The checks job

`.github/workflows/checks.yml`:

```yaml
name: checks

on:
  push:

concurrency:
  group: checks-${{ github.ref }}
  cancel-in-progress: true

jobs:
  checks:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: yarn

      - run: yarn install --immutable
      - run: yarn lint
      - run: yarn typecheck
      - run: yarn test
```

Line by line, the parts that are not obvious:

* **`on: push`** runs on every push to any branch. A pull request is made of pushes, so this already covers them —
  adding `pull_request:` as well would run everything twice for the same commit.
* **`concurrency`** with `cancel-in-progress` stops a still-running check when a newer push arrives on the same
  branch. Nobody needs the result for a commit that has already been replaced.
* **`timeout-minutes`** caps a stuck job. Without it, a hung step holds the runner for six hours.
* **`cache: yarn`** makes `setup-node` keep Yarn's download cache between runs, so installs do not refetch every
  package.
* **`--immutable`** fails the install if `yarn.lock` would change. That is the point: it catches a dependency added in
  `package.json` without the lockfile being updated and committed.

The action versions (`@v4`) are the current majors at the time of writing; check for newer ones when setting this up.

## Part 6 — The preview smoke test

`.github/workflows/preview-smoke.yml`:

```yaml
name: preview-smoke

on:
  pull_request:
    paths-ignore:
      - "docs/**"
      - "**/*.md"
  workflow_dispatch:

concurrency:
  group: smoke-${{ github.ref }}
  cancel-in-progress: true

jobs:
  smoke:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    steps:
      - name: Free disk space
        run: |
          sudo rm -rf /usr/share/dotnet /usr/local/lib/android /opt/ghc /opt/hostedtoolcache/CodeQL
          docker image prune --all --force
          df -h /

      - uses: actions/checkout@v4

      - name: Start the preview environment
        run: docker compose --env-file .env.ci up --detach --build --wait --wait-timeout 900

      - name: Generate a test video
        run: |
          sudo apt-get update && sudo apt-get install --yes ffmpeg
          ffmpeg -f lavfi -i testsrc=duration=5:size=640x360:rate=30 \
                 -f lavfi -i sine=frequency=440:duration=5 \
                 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest test.mp4

      - name: Smoke test
        run: ./scripts/smoke-test.sh

      - name: Collect logs
        if: failure()
        run: docker compose logs --no-color --timestamps > compose-logs.txt

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: compose-logs
          path: compose-logs.txt
```

Step by step:

**Free disk space.** The runner ships with toolchains this project never uses — .NET, the Android SDK, Haskell,
CodeQL — which take tens of gigabytes. Removing them before building twenty-odd images is the difference between the
job working and dying halfway through a build with "no space left on device". The `df -h /` line prints how much is
free, which is the first thing to look at when a build runs out of room.

**Start the preview environment.** `compose.yaml` is the preview environment (`environments-explained.md`, Part 4), so
no `-f` is needed. `--build` builds every image from the checked-out code. `--wait` blocks until every service is
running **and healthy**, and `--wait-timeout` gives up after 15 minutes instead of waiting forever — Keycloak and
Elasticsearch are slow to start the first time.

**`.env.ci`** is a committed file holding the variables CI runs with: dummy credentials, and smaller memory limits
than a developer machine gets (see Part 8). It must never contain a real secret — this repository is public, and so is
every file in it.

**Generate a test video.** FFmpeg can synthesise video and sound from nothing: `testsrc` draws a moving test pattern,
`sine` plays a tone. Five seconds at 640×360 is enough to push a file through the whole pipeline, and nothing binary
has to be committed. The `apt-get` line installs FFmpeg in case the runner image does not include it; it is harmless if
it does.

**The smoke test.** A short script — `curl` and `jq` are enough — that walks through one real path across the system,
through the gateway:

1. Sign up a user, keeping the auth cookies (`curl -c cookies.txt -b cookies.txt`). An unconfirmed email can use the
   app (US-Auth-02), so there is no confirmation link to click in CI.
2. Initialise an upload, create a tus upload (`POST` with `Tus-Resumable: 1.0.0`, `Upload-Length` and
   `Upload-Metadata`), then send the whole file in one `PATCH` with `Content-Type: application/offset+octet-stream`
   and `Upload-Offset: 0`.
3. Poll the upload's status every few seconds, **with a deadline**, until the lowest quality is ready.
4. Publish the video, call the watch endpoint, then fetch the master playlist it returns through the gateway, and check
   it lists at least one rendition.

That one path exercises the gateway and Keycloak, the sign-up saga across three services, tus and its hooks, Kafka,
BullMQ and FFmpeg, MinIO, the events back to `video-api`, and the HLS token check in nginx. If any of those is broken,
the smoke test fails, and it does so in about a minute once the stack is up.

**Logs on failure.** When anything fails, the runner is thrown away seconds later, taking every container's logs with
it. `if: failure()` saves them as an **artifact** — a file attached to the run that can be downloaded from the run's
page. Without this step, a failed smoke test says only "failed".

**Triggers.** It runs on pull requests, skipping those that only touch docs, and on demand via `workflow_dispatch`,
which adds a "Run workflow" button to the Actions tab. If work mostly goes straight to `develop` without pull
requests, add `push: branches: [develop]` so it still runs somewhere.

## Part 7 — Making it faster, later

None of this is needed on day one:

* **Cache Docker layers** between runs. Building every image from scratch is most of the job's time; Buildx can store
  layers in the GitHub Actions cache so unchanged services are not rebuilt.
* **Run the checks only for changed workspaces**, once there are enough of them for the full run to feel slow.
* **Make both jobs required** before merging into `master`, through branch protection — once they pass reliably, not
  before, or a flaky check blocks every merge.

## Part 8 — Traps

* **`--wait` trusts healthchecks.** A service without one counts as ready the moment its process starts, so the smoke
  test can begin before the service can answer. Every service the smoke test calls needs a healthcheck that reflects
  real readiness (`infrastructure.md`).
* **Elasticsearch sizes its own heap from the machine's memory**, and on a 16 GB runner it takes far more than it
  needs. Cap it in `.env.ci` (`ES_JAVA_OPTS=-Xms512m -Xmx512m`); do the same for Kafka (`KAFKA_HEAP_OPTS`). The Compose
  files read these as variables with defaults, and CI simply sets smaller values.
* **Never `sleep` and hope.** Counts, processing and indexing are all eventually consistent, so a fixed `sleep 30`
  passes on a quiet day and fails on a slow one. Poll the actual state with a deadline, and fail with a clear message
  when the deadline passes.
* **Dummy secrets only.** The preview environment needs no real credentials, and `.env.ci` is public. Anything real
  goes into repository secrets — and nothing in these two jobs should need any.
* **One instance hides bugs.** Several bugs in this system only appear with two instances of a service
  (`scaling-to-multiple-instances.md`, Part 12). The smoke test is the cheapest place to catch them: start it with
  `--scale video-upload-api=2`, and the upload-progress path through Redis pub/sub gets tested for free.
* **Private would not fit.** Everything above assumes the repository stays public. On a private repository the runner
  has half the memory and the minutes are no longer unlimited — the smoke test would need a larger paid runner, or to
  be dropped.
