## US-Search-01 — Search videos

**Description**

As a registered user with a verified account, I want to search videos by a query, narrow the results with filters and
choose how they are ordered, so that I can find a specific video instead of browsing for it.

**User flows**

Search videos — main flow:

1. User opens any page that has the top navbar.
2. User sees the search input with two icon buttons inside it, on the right: filters and sorting, and a toggle between
   video and channel search. The toggle is set to **videos** by default, its icon shows the current mode, and the
   placeholder reads "Search videos...".
3. User enters the search query.
4. User clicks the filters and sorting icon inside the search input; a popup opens with:
    * **Upload date** — Last hour, Today, This week, This month, This year;
    * **Duration** — Shorter than 5 minutes, 5-15 minutes, 16-30 minutes, Longer than 30 minutes;
    * **Order** — Relevancy, Recently uploaded, Most popular.
5. User selects the filters and the order they want. No filter is selected by default, and the default order is
   Relevancy.
6. User presses Enter or clicks the search button.
7. The app opens the dedicated search page, which loads the results.
8. User sees the videos matching the query, filtered and ordered as selected.
9. User clicks a video and its video page opens.

Search videos — branches:

* **No filters chosen** (step 4) — the popup is optional; searching without opening it uses no filters and orders by
  Relevancy.
* **Removing filters** (step 5) — a selected option shows an × that removes it, and the "Clear filters" button in the
  popup removes every filter at once. The order is not a filter and keeps its value.
* **Empty query** (step 6) — nothing is submitted and the user stays where they are.
* **No results** (step 8) — the page shows an empty state saying nothing matched, not an error.
* **Request fails** (step 7) — the results are page data, so the failure is shown as a full-screen error state with a
  retry action ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The search input is available on every page that has the top navbar, with two icon buttons inside it: filters and
  sorting, and a toggle between video and channel search.
* The toggle is on videos by default; its icon shows the current mode, and the placeholder says what is being searched
  ("Search videos...").
* The filters and sorting popup offers Upload date and Duration filters, and the three order options, exactly as listed
  above.
* No filter is selected by default; the default order is Relevancy.
* Each filter group allows one option at a time; the selected option is highlighted and has an × that removes it.
* "Clear filters" removes every selected filter at once and leaves the order as it is.
* Submitting the search opens the dedicated search page, which loads and shows the results.
* Results match the query and respect the selected filters and order.
* Videos of channels that are not available (soft deleted — see
  [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)) never appear in results.
* Age-restricted videos are excluded for users whose date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young.
* A query with no matches shows an empty state, not an error.
* Results are paginated, with page controls at the bottom of the page; the list does not load more on scroll.
* Clicking a result opens the corresponding video page.
* Failures follow the error flow for page data ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* On desktop, the popup lays out Upload date, Duration and Order as three columns, and each result is a row with the
  thumbnail on the left and the title, channel name and view count on the right.
* On mobile, the filters and sorting open as a bottom drawer instead of a popup, with each group's options laid out as
  chips; tapping a selected option removes it.
* On mobile, results are a single column of cards: a full-width thumbnail, and under it the channel avatar, the title,
  the channel name, the view count and the upload date.

**Tech notes**

* Use Elasticsearch in Docker for the search implementation, reached through the API — the client never talks to
  Elasticsearch directly.
* The Search service owns its index and fills it by consuming Kafka events: videos are indexed when published, updated
  when changed and dropped when their channel or account is deleted. This is the same fan-out the channel-updated event
  already uses ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)), so consumers must be
  idempotent and deduplicate.
* Visibility still has to be enforced when serving: the index lags behind the database, and a soft-deleted channel has
  to disappear from results immediately rather than at the next re-index.
* The uploader's channel name and avatar are denormalized into the video document so results render without calling the
  Channels service per hit; they are refreshed by the same channel-updated event.
* The query, the filters and the order belong in the URL of the search page, so that reloading it or sharing the link
  reproduces the same results.
* Duration and upload date are range queries over indexed fields — keep duration in seconds and the upload date as a
  timestamp, and translate the UI buckets on the API side rather than storing the buckets.
* Results are paginated with classic page controls at the bottom of the search page, not infinite scroll.
* Elasticsearch limits how deep `from`/`size` paging can go (`index.max_result_window`), so either cap the number of
  reachable pages or switch to `search_after` for deep ones.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=96-476&p=f&t=hZh5ti3bRSHbCDEe-0)
* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Search-02 — Search channels](./US-Search-02-Search-channels.md)
* [US-Search-03 — Search videos on the channel page](./US-Search-03-Search-videos-on-channel-page.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
