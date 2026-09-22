## Resolve gateway upstreams on every request

Needs: [Task-20 — Add the apps to Compose](Task-20-Add-the-apps-to-Compose.md)

Make nginx resolve upstream hostnames through Docker's DNS on every request — `resolver 127.0.0.11 valid=10s` and a
variable in `proxy_pass` — instead of once at startup. A variable in `proxy_pass` changes how nginx passes the URI, so
rewrite the routes with that in mind rather than adding it afterwards.

Why: nginx caches the address it resolved at startup, so a service scaled to three instances keeps receiving every
request on one of them, and nothing errors
([scaling-to-multiple-instances.md](../../../../explainers/scaling-to-multiple-instances.md), Part 4).
