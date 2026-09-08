## US-Recommendations-01 — Feed (V1)

**Description**

As a registered user with a verified account, I want the homepage to show me a list of videos, so that I always have
something to watch — even before real recommendations exist.

V1 is a placeholder: the feed returns random videos. Everything around the candidate source — filtering, limits,
pagination and the response shape — is built for real, so that V2
([US-Recommendations-03](./US-Recommendations-03-Feed-V2.md)) only replaces where the candidates come from.

**User flows**

Open the feed — main flow:

1. User opens the homepage.
2. The app requests the feed for the channel the user is currently acting as.
3. User sees a list of videos.
4. User scrolls or pages further and more videos are loaded.

Open the feed — branches:

* **Nothing to show** (step 3) — every candidate was filtered out, or the platform has no videos yet; the page shows an
  empty state instead of a blank list.
* **Request fails** (step 2) — the feed is page data, so the failure is shown as a full-screen error state with a retry
  action ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The homepage shows a paginated list of videos to an authenticated user.
* In V1 the candidates are picked at random; no watch, like or dislike history is taken into account.
* Candidates pass through the same filtering the real feed will use:
    * videos of channels that are not available (soft deleted — see
      [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
      [US-Account-01](../account/US-Account-01-Delete-own-account.md)) are never returned;
    * age-restricted videos are excluded for users whose date of birth
      ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young.
* Paging through the feed never repeats a video already returned on an earlier page, and never skips one.
* The response shape is the final one — V2 changes the candidate source, not the contract.
* An empty result shows an empty state, not an error.
* Failures follow the error flow for page data ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Tech notes**

* Build the pipeline shape now, with the source stubbed: **candidates → filter → limit → paginate**. V2 swaps only the
  first step, so the filtering rules are exercised from the start, which is where the soft-delete and age rules are most
  likely to be wrong.
* Random ordering and pagination conflict: a fresh `ORDER BY random()` per page returns duplicates and skips entries.
  Use a seed fixed per feed session (returned with the first page and sent back with the next), or a deterministic
  shuffle by a hash of video id and seed.
* The feed is requested for the **current channel**, not the account — the channel id already travels in a header and is
  validated at the gateway ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)). V2 depends
  on this being settled, so fix it here.
* Filtering by visibility happens at serve time against the current state, never by trusting a precomputed list — the
  same rule that will apply once a recommender is involved.
* Whether the feed excludes videos the user has already watched needs a decision; V1 does not exclude them.
* No recommender infrastructure is deployed for V1.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Recommendations-03 — Feed (V2)](./US-Recommendations-03-Feed-V2.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
