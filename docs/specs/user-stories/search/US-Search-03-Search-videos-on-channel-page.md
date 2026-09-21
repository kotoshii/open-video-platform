## US-Search-03 — Search videos on the channel page

**Description**

As a registered user, I want to search within the videos of the channel I'm looking at, so that
I can find something in its catalogue without searching the whole platform.

**User flows**

Search within a channel — main flow:

1. User opens any channel page ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).
2. Above the video list, on one line, user sees the sort buttons — Newest, Most viewed, Oldest — and the search input.
   On mobile only a search icon sits next to the sort buttons, and pressing it reveals the input below them.
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
* On mobile the search input is hidden by default to save space, and a search icon next to the sort buttons reveals it
  below them.
* Searching returns only videos belonging to that channel.
* A video matches when the query appears in its title or in its description; tags are not searched here.
* The search covers exactly what the video list on that page covers: on the author's own channel it reaches their
  unpublished, private and still-processing videos too
  ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)), and on someone else's it reaches only
  what a visitor can see.
* The selected sorting is applied to the search results, with Newest as the default.
* No filters are offered here — the Upload date and Duration filters belong to the global video search
  ([US-Search-01](./US-Search-01-Search-videos.md)).
* Results replace the video list on the channel page; the user is not taken to the global search page.
* Clicking a result opens the video page, the same as from the unfiltered list.
* A query with no matches shows an empty state in place of the list.
* Failures are shown as a toast, and the page keeps working.

**Tech notes**

* **This search runs against the Videos service database, not Elasticsearch.** The index only ever holds published
  videos ([US-Search-01](./US-Search-01-Search-videos.md)), while the author's own channel page lists everything they
  have — private, accessible by link, still uploading or processing, failed
  ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)). An Elasticsearch-backed search would
  quietly fail to find videos the author can see in the list directly above the search box.
* A substring match over the video's **title and description**, scoped by channel id, is enough here: the scope is a
  single channel, and this is the same kind of match the watch history and my comments searches already use
  ([US-My-activity-01](../my-activity/US-My-activity-01-Watch-history.md)). `pg_trgm` is the step after it if it ever
  becomes slow, and the description is the field that will ask for that index first, being far longer than a title.
* Nothing has to be denormalized for it, unlike those two: this runs in the service that owns the videos, so the title
  and the description are already on the row. Watch history and my comments keep their own copy of the title precisely
  because they do not own it.
* Searching therefore returns exactly the rows the list would, filtered by the same rules — which is what keeps "what
  I can find" equal to "what I can see" for author and visitor alike.
* Expose a separate endpoint for the channel page rather than overloading the global one.
* The response can be smaller than the global one: the channel is already known, so the channel name and avatar do not
  need to be repeated per hit. Decide the exact shape when the endpoint is written.
* The visibility rules still apply — a purged channel has no page to search on, and age-restricted videos are
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
