## Run Keycloak with an imported realm

Needs: [Task-04 — Add healthchecks to the infrastructure containers](Task-04-Add-healthchecks-to-the-infrastructure-containers.md)

Add Keycloak to `infra.yaml`, importing `docker/keycloak/realm.json` on start. Create the realm and the clients here;
the realm's settings — token lifespans, claim mappers, required actions — are added by the auth stories.

Pin one hostname with `KC_HOSTNAME` that containers and apps on the host both use.

Why: every token records the address it was issued from in `iss`. A token issued through `localhost` fails validation
where `keycloak` is expected, so logging in works and every call after it returns `401`
([environments-explained.md](../../../../explainers/environments-explained.md), Part 6).
