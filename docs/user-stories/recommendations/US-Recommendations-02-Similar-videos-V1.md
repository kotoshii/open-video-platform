## US-Recommendations-02 — Similar videos (V1)

**Description**

As a registered user with a verified account, I want to see a list of other videos next to the one I'm watching, so that
I have something to continue with when it ends.

V1 is a placeholder: the list is filled with random videos. As with the feed
([US-Recommendations-01](./US-Recommendations-01-Feed-V1.md)), everything except the candidate source is built for real,
so V2 ([US-Recommendations-04](./US-Recommendations-04-Similar-videos-V2.md)) only replaces where the candidates come
from.

**User flows**

See similar videos — main flow:

1. User opens a video page.
2. The app requests videos to show alongside the one being watched.
3. User sees the list next to the player (on the right on desktop).

See similar videos — branches:

* **Nothing to show** (step 3) — every candidate was filtered out, or the platform has too few videos; the section shows
  an empty state rather than an empty block.
* **Request fails** (step 2) — the list is a section of the page, not the page itself, so it shows its own error state
  with a retry action and the video keeps playing ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The video page shows a list of at most 20 videos next to the player.
* In V1 the candidates are picked at random; no similarity is computed.
* The video currently being watched is never in the list.
* Candidates pass through the same filtering the real list will use:
    * videos of channels that are not available (soft deleted — see
      [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
      [US-Account-01](../account/US-Account-01-Delete-own-account.md)) are never returned;
    * age-restricted videos are excluded for users whose date of birth
      ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young.
* If fewer than 20 videos survive filtering, the list shows what is available rather than padding it out.
* The list is not paginated — it is a fixed block of up to 20.
* A failure in this section does not break the video page.

**Tech notes**

* Same pipeline shape as the feed — **candidates → filter → limit** — with the source stubbed. There is no pagination
  here, so no seeding is needed; each page load may show a different random set.
* The "when nothing similar is found, fall back to random" rule from the original notes belongs to V2. In V1 random *is*
  the source, so there is nothing to fall back from.
* Excluding the current video happens in the filtering step, not by trimming the result afterwards, so the list can
  still reach 20 entries.
* No recommender infrastructure is deployed for V1.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Recommendations-01 — Feed (V1)](./US-Recommendations-01-Feed-V1.md)
* [US-Recommendations-04 — Similar videos (V2)](./US-Recommendations-04-Similar-videos-V2.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
