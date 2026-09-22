## Create email-worker

Needs: [Task-20 — Add the apps to Compose](Task-20-Add-the-apps-to-Compose.md),
[foundation Task-06 — Add Redis and BullMQ builders to lib](../foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

Create `email-worker` in the new structure, and add it to Compose with its topic. It consumes "send this email" events
and sends them with nodemailer, with the SMTP settings from the environment.

* An event names the template, the recipient's account id and the values the template needs — never an address.
* A failed send is retried and logged; it never reaches the service that asked for the email.
* Kafka may deliver an event twice. The worker has no database of its own, so skip an event id already sent with a
  Redis key that expires, and delete the key again if the send fails.

Why: no user-facing request waits on mail delivery, and a failed send never fails the action that caused it
([infrastructure.md](../../../infrastructure.md), email module).
