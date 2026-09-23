## Let containers reach apps running on the host

Needs: [Task-10 — Run tusd behind the gateway](Task-10-Run-tusd-behind-the-gateway.md)

In development the apps run on the host, but nginx and tusd still call them. Take the upstream hosts in the gateway
template and tusd's hook URL from environment variables — `video-api:3000` in preview, `host.docker.internal:<port>` in
development — and add `extra_hosts: ["host.docker.internal:host-gateway"]` for Linux.

Why: there is still one gateway template for every environment, with only the values changing.
