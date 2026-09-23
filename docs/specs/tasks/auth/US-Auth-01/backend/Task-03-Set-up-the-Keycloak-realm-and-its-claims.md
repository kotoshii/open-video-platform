## Set up the Keycloak realm and its claims

Needs: [_platform infrastructure Task-15 — Run Keycloak with an imported realm](../../../_platform/infrastructure/Task-15-Run-Keycloak-with-an-imported-realm.md)

Create the platform's realm and its client in the realm file the platform task imports.

* The client allows the direct access grant, so `auth-api` can exchange an email and a password for tokens without
  sending anyone to Keycloak's own pages.
* Map the user's `birthdate` and `channelIds` attributes into the access token, next to `email_verified`, which Keycloak
  puts there itself.
* Turn on Keycloak's brute force protection, so repeated wrong passwords are its problem rather than ours.

Why: the gateway reads those claims out of the token and hands them to the services as headers, so a claim missing here
turns into a service that cannot filter by age or check a channel id.
