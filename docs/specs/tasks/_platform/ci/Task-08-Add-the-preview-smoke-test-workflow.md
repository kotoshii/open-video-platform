## Add the preview smoke test workflow

Needs: [Task-07 — Write the smoke test script](Task-07-Write-the-smoke-test-script.md)

Add `.github/workflows/preview-smoke.yml`, as in
[ci-with-github-actions.md](../../../../explainers/ci-with-github-actions.md), Part 6:

* free disk space, then start the preview environment with `--env-file .env.ci`, `--build`, `--wait` and a wait
  timeout, and with `--scale video-upload-api=2`;
* generate a five-second test video with FFmpeg's `testsrc` and `sine` sources;
* run the smoke test;
* on failure, save every container's logs as an artifact.

Run it on pull requests that change more than docs, on pushes to `develop`, and on demand.

Why: some bugs only appear with two instances — upload progress through Redis pub/sub among them — and CI is the
cheapest place to run two. Without the logs artifact a failure says only "failed", because the runner is thrown away
seconds later.
