## US-Search-03 — Search videos on the channel page

**Description**

As a registered user with a verified account, I want to search within the videos of the channel I'm looking at, so that
I can find something in its catalogue without searching the whole platform.

**User flows**

Search within a channel — main flow:

1. User opens any channel page ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).
2. Above the video list, on one line, user sees the sort buttons — Newest, Most viewed, Oldest — and the search input.
3. User enters the search query and presses Enter or clicks the search button.
4. The current sorting option is sent along with the query; Newest is the default.
5. The video list is replaced by the videos of this channel matching the query, in the selected order.
6. User clicks a video and its video page opens, exactly as from the unfiltered list.

Search within a channel — branches:

* **Empty query** (step 3) — nothing is submitted; the full video list stays as it is.
* **No results** (step 5) — the list area shows an empty state saying nothing in this channel matched.
* **Request fails** (step 3) — this is an action on an already loaded page, so the failure is shown as a toast and the
  current list stays ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The channel page has a search input on the same line as the Newest, Most viewed and Oldest sort buttons.
* Searching returns only videos belonging to that channel.
* The selected sorting is applied to the search results, with Newest as the default.
* No filters are offered here — the Upload date and Duration filters belong to the global video search
  ([US-Search-01](./US-Search-01-Search-videos.md)).
* Results replace the video list on the channel page; the user is not taken to the global search page.
* Clicking a result opens the video page, the same as from the unfiltered list.
* A query with no matches shows an empty state in place of the list.
* Failures are shown as a toast, and the page keeps working.

**Tech notes**

* Reuse the Elasticsearch queries built for the global video search ([US-Search-01](./US-Search-01-Search-videos.md)),
  with the channel id as an additional constraint — but expose a
  separate endpoint for the channel page rather than overloading the global one.
* The response can be smaller than the global one: the channel is already known, so the channel name and avatar do not
  need to be repeated per hit. Decide the exact shape when the endpoint is written.
* The visibility rules still apply — a soft-deleted channel has no page to search on, and age-restricted videos are
  excluded for users too young by date of birth ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)).
* Results are paged the same way the channel's own video list is
  ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)), so searching does not change how the
  list behaves — only what it contains.
* Sorting here differs from the global search on purpose: the channel page offers Newest, Most viewed and Oldest, and
  has no Relevancy option, so a query is ranked by the chosen order rather than by match quality.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=96-476&p=f&t=hZh5ti3bRSHbCDEe-0)
* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Channels-04 — See own and other channels](../channels/US-Channels-04-see-own-and-other-channels.md)
* [US-Search-01 — Search videos](./US-Search-01-Search-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
