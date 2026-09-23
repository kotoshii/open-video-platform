## US-Search-01 — Search videos

**Description**

As a registered user, I want to search videos by a query, narrow the results with filters and
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
* A search finds other forms of the same word, in English and in Ukrainian — "cats" finds "cat", and "котик" finds
  "котики".
* Videos of channels that no longer exist never appear in results. A channel scheduled for deletion is still a live
  channel, so its videos are found as usual until the purge runs
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md),
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* Age-restricted videos are excluded for users whose date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young, and for channels whose
  "Show age-restricted content" setting is off
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
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
* **Language analysis.** Titles and descriptions may be English or Ukrainian, and a video's language is not recorded.
  A field can have only one analyzer, so index title and description as multi-fields: the base field with the
  `standard` analyzer, `.en` with the built-in `english` analyzer, and `.uk` with the `ukrainian` analyzer — then
  query all three with `multi_match`. Every video's text goes through every language's analyzer; the one that fits
  produces proper word roots, and the others only add a few harmless terms.
* The `ukrainian` analyzer is **not built into Elasticsearch**. It comes from the official `analysis-ukrainian`
  plugin, which reduces Ukrainian words to their base form, so "котик", "котики" and "котиків" match each other.
  Without it, Cyrillic text is still split into words correctly, but every form of a word counts as a different word.
  The plugin has to be part of the Elasticsearch image — it cannot be added to a running node
  ([infrastructure.md](../../infrastructure.md)).
* Adding a language later: most have a built-in analyzer — German, French, Russian, Spanish and about thirty others —
  so they need only a new sub-field and a re-index. A few need a plugin: Polish (`analysis-stempel`), Japanese, Korean
  and Chinese. `analysis-icu` splits and normalises text in any language, but does not reduce words to their roots, so
  it is a fallback for a language with no analyzer, not a replacement for one.
* **Language detection is deliberately not used** while the app has two languages. Indexing every video through every
  analyzer already handles English, Ukrainian and mixed titles ("Minecraft стрім #5") with nothing to guess, and
  queries have to cover every language field anyway, since a search's language is unknown too. Detection would add a
  way to be wrong without making the search side simpler.
* It becomes worth it once there are many languages and running every video through every analyzer gets expensive.
  Then: detect the language from title, description and tags when indexing — a small in-process detector such as
  `franc`, `eld` or `tinyld`, or simply the alphabet (Cyrillic or Latin) when that is enough — and index the text into
  that language's field only. Keep indexing into every field as the fallback for text the detector is not confident
  about: titles are short and often mixed, which is exactly where detectors are weakest.
* The Search service owns its index and fills it by consuming Kafka events: videos are indexed when published, updated
  when changed and dropped when their channel or account is deleted. This is the same fan-out the channel-updated event
  already uses ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)), so consumers must be
  idempotent and deduplicate.
* Visibility still has to be enforced when serving: the index lags behind the database, so a video just made private,
  or one whose channel has just been purged, has to disappear from results immediately rather than at the next
  re-index.
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

* [Task-01 — Create search-api](../../tasks/search/US-Search-01/backend/Task-01-Create-search-api.md)
* [Task-02 — search-api: Define the video index](../../tasks/search/US-Search-01/backend/Task-02-search-api-Define-the-video-index.md)
* [Task-03 — search-api: Index videos from their events](../../tasks/search/US-Search-01/backend/Task-03-search-api-Index-videos-from-their-events.md)
* [Task-04 — video-api: Look up the visible videos over gRPC](../../tasks/search/US-Search-01/backend/Task-04-video-api-Look-up-the-visible-videos-over-gRPC.md)
* [Task-05 — search-api: Implement GET /search/videos](../../tasks/search/US-Search-01/backend/Task-05-search-api-Implement-GET-search-videos.md)

FE:

* [Task-06 — Build the search input in the navbar](../../tasks/search/US-Search-01/frontend/Task-06-Build-the-search-input-in-the-navbar.md)
* [Task-07 — Build the video search page](../../tasks/search/US-Search-01/frontend/Task-07-Build-the-video-search-page.md)
