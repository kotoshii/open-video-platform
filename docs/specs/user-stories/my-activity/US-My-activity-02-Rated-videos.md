## US-My-activity-02 — Rated videos

**Description**

As a registered user with a verified account, I want to see the videos I have liked or disliked in one place and
change those rates, so that I can find the videos I rated and keep my rates the way I want them.

This replaces a "liked videos" page: both likes and dislikes are listed, with a toggle to show only the liked ones. The
rates are the current channel's.

**User flows**

See rated videos — main flow:

1. User clicks "Rated videos" in the sidebar ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
2. User sees the videos the current channel has rated, most recently rated first — only the liked ones, by default.
3. Each item shows the thumbnail, the title, the channel name, the view count, when it was rated, and the like and
   dislike buttons with the current rate filled in.
4. The list is paginated, with page controls at the bottom.
5. User clicks an item and its video page opens.

Show dislikes as well:

1. User switches off "Show only liked videos" on the right.
2. The list is loaded again with both likes and dislikes.
3. The choice is kept in the page address and remembered in the browser.

Search:

1. User types into the search bar at the top and submits.
2. The list shows only the rated videos whose title contains the query.

Change a rate:

1. User clicks the opposite button on an item.
2. The rate switches straight away; the list is not loaded again.

Remove a rate:

1. User clicks the filled button on an item.
2. A confirmation modal appears, since removing the rate removes the video from this list.
3. User confirms; the rate is removed and the list is loaded again.

Branches:

* **Switching to a dislike while "Show only liked videos" is on** — the item stays where it is, showing the dislike,
  until the list is loaded again.
* **The author has turned rates off for the video** ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)) —
  changing the rate is rejected and a toast explains why.
* **A rated video is no longer available** — it is not shown.
* **No rated videos, or nothing matches the search** — the list shows an empty state.
* **Cancelling the confirmation** — the modal closes and the rate stays.
* **The list fails to load** — a full-page error state with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Changing or removing a rate fails** — the button returns to its previous state and the default toast behaviour
  applies.

**Acceptance criteria**

* The sidebar has a "Rated videos" item that opens the page.
* The page lists the videos the current channel has liked or disliked, most recently rated first, with page controls at
  the bottom — no infinite scroll.
* Each item shows the thumbnail, the title, the channel name, the view count and when it was rated.
* Each item has like and dislike buttons that are always visible, with the current rate filled in; no counts are shown.
* "Show only liked videos" sits on the right and is on by default.
* The toggle is reflected in a query parameter and remembered in localStorage. An address that carries the parameter
  wins; without it, the remembered choice applies; without that, the toggle is on.
* Switching between like and dislike updates the button immediately, without loading the list again, and reverts if the
  request fails.
* Removing a rate asks for confirmation, then loads the list again.
* The search bar finds videos whose title contains the query, and is submitted rather than filtering as the user types.
* The first load shows skeletons. Loading the list again after a change — removing a rate, flipping the toggle — keeps
  the current items on screen instead of showing skeletons.
* Videos that are no longer available are not shown.
* Failures to load the list are shown as a full-page error; failures to change a rate are shown as a toast.

**Tech notes**

* This is the rate data from [US-Videos-04](../videos/US-Videos-04-Like-dislike-videos.md) listed from the rater's side:
  rates belong to the acting channel, and the list is ordered by when each rate was last set.
* A rate change here is a button-state change only, exactly as on the video page — no counts are shown, so nothing needs
  adjusting.
* Removing a rate loads the list again because the item leaves the list and the pages shift. Switching a rate does not,
  because the item stays — which is also why a switched item can briefly not match the "only liked" filter.
* The address wins over the remembered toggle so that a reloaded or shared link shows what it says.
* The search has the same constraint as the watch history ([US-My-activity-01](./US-My-activity-01-Watch-history.md)):
  a substring match needs the title in the same database as the rate rows, so store it there and refresh it from the
  video-updated event.
* Visibility is enforced when the list is served.

**Links**

* [US-My-activity-01 — Watch history](./US-My-activity-01-Watch-history.md)
* [US-UI-UX-03 — Global layout](../ui-ux/US-UI-UX-03-Global-layout.md)
* [US-Videos-03 — Manage own videos](../videos/US-Videos-03-Manage-own-videos.md)
* [US-Videos-04 — Like/dislike videos](../videos/US-Videos-04-Like-dislike-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
