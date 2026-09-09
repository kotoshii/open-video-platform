registered verified user...

1. user opens any page that has the navbar on top.
2. sees search input in it.
3. near search input on the right - toggle "videos/channels"; default - videos.
4. user enters the search query
5. to select optional filters and/or sorting - user clicks the corresponding button near the search bar
6. when filter/sorting button clicked a pop up appears
7. pop up has the following options:

Upload date (filter):

* Last hour
* Today
* This week
* This month
* This year

Duration (filter):

* Shorter than 5 minutes
* 5-15 minutes
* 16-30 minutes
* Longer than 30 minutes

Order:

* (default) Relevancy
* Recently uploaded
* Most popular

8. no filters are selected by default, but default order is Relevancy
9. user can select and remove filters by clicking them or remove all by clickign the corresponding button in the popup
10. once search query is entered and filters/order selected, user presses enter or clicks the search button
11. app redirects to the dedicated search page which loads the results
12. error hadnling falls into the Failed page data loading section in UI-UX-02
13. on success the list of the searched vidoes appears, sorted and filtered as user set and relevant to the search query
14. clicking video item opens the corresponding video page

- use elasticsearch in docker for search implementation; access it via the API

https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=96-476&p=f&t=hZh5ti3bRSHbCDEe-0

=== GENERATED ===

## US-Search-01 — Search videos

**Description**

As a registered user with a verified account, I want to search videos by a query, narrow the results with filters and
choose how they are ordered, so that I can find a specific video instead of browsing for it.

**User flows**

Search videos — main flow:

1. User opens any page that has the top navbar.
2. User sees the search input, with a "videos / channels" toggle to its right, set to **videos** by default.
3. User enters the search query.
4. User clicks the filters and sorting button next to the search bar; a popup opens with:
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
* **Removing filters** (step 5) — a selected filter is removed by clicking it again, and all of them at once with the
  "clear all" button in the popup.
* **Empty query** (step 6) — nothing is submitted and the user stays where they are.
* **No results** (step 8) — the page shows an empty state saying nothing matched, not an error.
* **Request fails** (step 7) — the results are page data, so the failure is shown as a full-screen error state with a
  retry action ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The search input and the "videos / channels" toggle are available on every page that has the top navbar, with the
  toggle on videos by default.
* The filters and sorting popup offers Upload date and Duration filters, and the three order options, exactly as listed
  above.
* No filter is selected by default; the default order is Relevancy.
* Filters can be removed one by one, or all at once from the popup.
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
