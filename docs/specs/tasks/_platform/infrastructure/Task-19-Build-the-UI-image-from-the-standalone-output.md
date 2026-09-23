## Build the UI image from the standalone output

Needs: [frontend Task-01 — Create the Next.js app](../frontend/Task-01-Create-the-Nextjs-app.md)

Add `docker/Dockerfile.ui`, which builds the Next.js app and runs its standalone output.

Why: the standalone output carries only the files the server needs, so the image stays small.
