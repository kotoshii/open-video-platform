## US-Account-04 — Download own user data

**Description**

As a registered user with a verified account, I want to download everything the platform stores about me and my
channels as a single file, so that I can keep my own copy of it outside the platform.

The export belongs to the account, not to a channel: one file covers every channel of the account, the same way the
email address and the password do.

**User flows**

Download the data — main flow:

1. User opens the settings page on the Account tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the "Download my data" section, stating what the file contains, that it covers every channel of the
   account, that the videos themselves are not part of it, that one export per hour is allowed, and when the last
   export was made.
3. User enters their current password and clicks "Download".
4. The server verifies the password.
5. More than an hour has passed since the last export, so the data is collected from every service that owns some of
   it, packed into an archive, stored, and the account's last export time is updated.
6. The response carries a link to the archive, valid for one hour, and the app opens it in a new tab.
7. The archive is downloaded in that tab.

Download the data — branches:

* **Within an hour of the last export** (step 5) — the archive built by that export is still stored, so a link to it
  is returned instead of a new archive being built. The section already states when it was made, so the user knows
  what they are getting.
* **The link has expired** (step 6) — the archive is deleted once its hour is up, so the link cannot be opened a second
  time. By then the limit has passed as well, so the user simply exports again.
* **No export yet** (step 2) — no date is shown; the section says that nothing has been exported so far.
* **Wrong password** (step 4) — the field shows an error and nothing is exported.
* **Collecting the data fails** (step 5) — the default toast behaviour applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)). No archive is stored and the hour does not start, so
  the user can try again straight away.

**Acceptance criteria**

* The Account tab has a "Download my data" section.
* The section states what the archive contains, that it covers every channel of the account, that video files are not
  included, that one export per hour is allowed, and the date and time of the last export — or that there has not been
  one yet.
* The current password is required for every export and is what authorises it; a wrong password is shown as a
  field-level error and exports nothing.
* An export requested more than an hour after the last one builds a fresh archive from the current data.
* An export requested within that hour returns the archive built by the last one, unchanged — not an error, and not a
  new archive.
* The response to an export carries a link to the archive, which the app opens in a new tab; no email is sent.
* The link is valid for one hour, and the archive is deleted once it expires.
* A link returned for an already stored archive expires together with that archive, not an hour after it was issued,
  so it never outlives the file it points at.
* An expired link cannot be opened again; by that time a new export is allowed anyway.
* The file is named after the platform and the export date, not after an internal id.
* The archive contains one JSON file per kind of data: the account, its channels, its videos, its comments and
  replies, its video and comment rates, its subscriptions, its watch history and its notification preferences.
* Every channel of the account is included, whichever channel the user is currently acting as.
* A channel that is soft deleted but still inside its restore window is part of the export, marked as deleted together
  with the date it was deleted; everything it owns is exported like any other channel's data.
* Videos are exported as metadata with a link to each video's page; the files themselves are not in the archive and
  are downloaded per video instead ([US-Videos-02](../videos/US-Videos-02-Download-videos.md)).
* The last export date shown is the moment the stored archive was built, so the user can tell how current the
  downloaded copy is.
* A failed export changes nothing — no archive is stored, and the next attempt is allowed immediately.
* Failures follow the default toast behaviour ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Tech notes**

* The export belongs to the service that owns the account record: the last export time is a plain column on that row,
  and the password check already lives there ([US-Account-03](./US-Account-03-Change-password.md)). The password is
  verified against Keycloak the same way, and failed attempts need the same throttling.
* Collection is a **synchronous fan-out over gRPC** — one call per owning service, issued in parallel — not over Kafka.
  Deletion can be a saga because nobody waits for its result; an export is a read with the user waiting for the answer,
  and Kafka offers no way to bring responses back into the request that asked.
* The services asked are the same ones channel deletion fans out over
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)): whatever service deletes data it owns also has
  data to export. Keep the two lists together — a service added to one and forgotten in the other either leaves data
  behind on deletion or drops it from the export without anyone noticing.
* If any service fails, the whole export fails: nothing is stored and the last export time is left untouched. A partial
  archive would look complete and quietly misrepresent what the platform holds.
* The one-hour limit is a column on the account rather than a Redis key, unlike the short cooldowns in
  [US-Auth-02](../auth/US-Auth-02-Account-confirmation.md) and [US-Auth-03](../auth/US-Auth-03-Password-reset.md): it
  outlives any token TTL, it has to be shown in the UI whenever the settings page loads, and it is the same value that
  decides whether the stored archive is reused.
* The archive is one object per account in its own MinIO bucket, overwritten by each new export, so serving a repeat
  request is handing out another link to that object.
* The link is a short-lived presigned MinIO URL, the same mechanism as video downloads
  ([US-Videos-02](../videos/US-Videos-02-Download-videos.md)), with the file name set through `Content-Disposition`.
  The export endpoint authorizes with the password and then only issues the URL, so a large-ish transfer never occupies
  an API process.
* **One hour is one value used three times**: the limit between exports, the lifetime of the link, and the lifetime of
  the stored archive. That is what keeps the states simple — at any moment there is either a stored archive with a
  usable link, or nothing at all and a fresh export allowed. Do not let the three drift apart.
* Consequently a link issued for an already stored archive must expire **when the archive does**, not an hour after it
  was issued. A URL signed for a full hour on top of an archive with twenty minutes left is a link that stops working
  while it still looks valid.
* S3 lifecycle rules expire objects by day, so they cannot do a one-hour deletion. Schedule the removal with a delayed
  BullMQ job when the export completes — BullMQ already does this kind of delayed work for video processing. Keep a
  lifecycle rule on the bucket as well, as a floor under missed jobs rather than as the mechanism.
* Because the request is a POST carrying the password, the front end gets the URL in the response and opens it. Opening
  a tab from an async callback rather than directly from the click can be caught by a popup blocker, so this needs
  checking in a browser — falling back to a visible "Download" link in the section is the escape hatch.
* Videos are exported as metadata plus the URL of each video's page. A presigned download URL per rendition would
  expire long before anyone opened the file.
* JSON rather than CSV, one file per kind of data: the data is nested — a video carries tags and counters, a comment
  belongs to a video — and separate files keep each one readable on its own.
* Building the archive inside the request is right at this scale, since it is per-account metadata. If one account's
  history ever grows enough for that request to run long, the fix is to build it in a background job and let the user
  come back for the stored archive — which already exists, because a repeat export serves exactly that object.
* **A soft-deleted channel inside its restore window is exported, carrying a flag that says so.** Until the purge runs
  it is still the account's data ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)), and the whole
  point of the restore window is that it may come back. Leaving it out would make the export disagree with what the
  platform actually holds; exporting it silently would misrepresent a deleted channel as a live one.
* That flag is on the channel entry, and everything else is tied to a channel by id, so the services returning videos,
  comments or subscriptions need no deleted-or-not notion of their own — they answer for every channel of the account
  and the channel list says which of them is deleted.

**Links**

* [US-Account-01 — Delete own account](./US-Account-01-Delete-own-account.md)
* [US-Account-03 — Change password](./US-Account-03-Change-password.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Channels-06 — Delete own channel](../channels/US-Channels-06-delete-own-channel.md)
* [US-Videos-02 — Download videos](../videos/US-Videos-02-Download-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
