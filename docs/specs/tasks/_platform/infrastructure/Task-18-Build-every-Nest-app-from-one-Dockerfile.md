## Build every Nest app from one Dockerfile

Add `docker/Dockerfile.nest`, which builds any API or worker chosen with `ARG APP`: install the dependencies, build
`proto`, `lib` and the app, and copy only what the app needs to run into a small final stage.

Why: one Dockerfile for twenty-odd apps means a fix to the build is made once.
