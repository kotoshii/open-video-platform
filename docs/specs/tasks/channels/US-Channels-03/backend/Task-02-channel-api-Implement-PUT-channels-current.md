## channel-api: Implement PUT /channels/current

Needs: [Task-01 — channel-api: Implement GET /channels/current](Task-01-channel-api-Implement-GET-channels-current.md)

`PUT /channels/current` — body `{ name, description, showAgeRestrictedContent }`

Main flow:

1. Take the channel from the `Channel-ID` header.
2. Check the name is not empty, and that the account is old enough for age-restricted content before letting the toggle
   go on, judged from the `Birthdate` header.
3. In one transaction, save the changes and write the channel-updated event to the outbox.

Branch — the name is empty:

1. A field-level error; nothing is saved.

Branch — the account is too young:

1. Reject the toggle with its code. The UI does not render it at all, but that is not the enforcement.

Why: every service that keeps a copy of the channel's name and avatar updates from that event
([US-Comments-01](../../../../user-stories/comments/US-Comments-01-See-comments.md),
[US-Search-01](../../../../user-stories/search/US-Search-01-Search-videos.md)) — deliberate eventual consistency, which
is why the UI warns that other pages may show the old values for a while.
