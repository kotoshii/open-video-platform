## US-Search-02 — Search channels

**Description**

As a registered user with a verified account, I want to search channels by a query and choose how the results are
ordered, so that I can find a channel by name instead of looking for one of its videos first.

**User flows**

Search channels — main flow:

1. User opens any page that has the top navbar.
2. User sees the search input, with a "videos / channels" toggle to its right.
3. User switches the toggle to **channels** and enters the search query.
4. User clicks the sorting button next to the search bar; a popup opens with the **Order** options: Relevancy and Most
   popular.
5. User selects the order. The default is Relevancy; Most popular means the most subscribers.
6. User presses Enter or clicks the search button.
7. The app opens the dedicated search page, which loads the results.
8. User sees the channels matching the query, ordered as selected.
9. User clicks a channel and its channel page opens
   ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).

Search channels — branches:

* **Default sorting kept** (step 4) — the popup is optional; searching without opening it orders by Relevancy.
* **Empty query** (step 6) — nothing is submitted and the user stays where they are.
* **No results** (step 8) — the page shows an empty state saying nothing matched, not an error.
* **Request fails** (step 7) — the results are page data, so the failure is shown as a full-screen error state with a
  retry action ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* Switching the navbar toggle to channels searches channels instead of videos.
* The sorting popup offers Relevancy and Most popular; there are no filters for channel search.
* The default order is Relevancy, and Most popular orders by subscriber count.
* Submitting the search opens the dedicated search page, which loads and shows the results.
* Channels that are not available (soft deleted — see
  [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)) never appear in results.
* A query with no matches shows an empty state, not an error.
* Results are paginated, with page controls at the bottom of the page; the list does not load more on scroll.
* Clicking a result opens the corresponding channel page.
* Failures follow the error flow for page data ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Tech notes**

* Use Elasticsearch in Docker, reached through the API — the same cluster as the video search, with its own index for
  channels.
* Channels are indexed when created ([US-Channels-01](../channels/US-Channels-01-create-multiple-channels.md)), updated
  on the channel-updated event ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)) and dropped
  when the channel or its account is deleted.
* Ordering by "Most popular" needs the subscriber count inside the channel document. The count is kept up to date in
  the channels database by the `subscriber-count-worker`, which applies subscription events in Kafka batches rather
  than writing on every subscribe and unsubscribe, and the index picks it up from there. The ordering is therefore slightly stale by design.
* Visibility is still enforced when serving, not only at index time, so a channel deleted a moment ago cannot surface.
* The query and the order belong in the URL of the search page, so reloading or sharing the link reproduces the results.
* Results are paginated the same way as in [US-Search-01](./US-Search-01-Search-videos.md): page controls at the
  bottom, no infinite scroll, and the same Elasticsearch paging depth limit applies.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=96-476&p=f&t=hZh5ti3bRSHbCDEe-0)
* [US-Channels-01 — Create multiple channels](../channels/US-Channels-01-create-multiple-channels.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Channels-04 — See own and other channels](../channels/US-Channels-04-see-own-and-other-channels.md)
* [US-Search-01 — Search videos](./US-Search-01-Search-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
