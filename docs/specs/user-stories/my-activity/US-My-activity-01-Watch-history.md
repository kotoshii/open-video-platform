## US-My-activity-01 — Watch history

**Description**

As a registered user, I want to see the videos I have watched, remove the ones I don't want
kept, and pause or clear my history, so that I can get back to something I watched and control what the platform
remembers about my viewing.

The history belongs to the channel the user is currently acting as.

**User flows**

See the history — main flow:

1. User clicks "Watch history" in the sidebar ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
2. User sees the videos the current channel has watched, most recently watched first.
3. Each item shows the thumbnail, the title, the channel name, the view count and when the video was watched.
4. The list is paginated, with page controls at the bottom.
5. User clicks an item and its video page opens.

Search the history:

1. User types into the search bar at the top and submits.
2. The list shows only the watched videos whose title contains the query, still most recent first.

Remove one video:

1. User hovers over an item and a delete button appears; on mobile it is always visible.
2. User clicks it and a confirmation modal appears.
3. User confirms; the video is removed from the history and the list is loaded again.

Clear the history:

1. User clicks "Clear watch history" on the right.
2. A confirmation modal says that the whole history will be removed.
3. User confirms; the current channel's history is removed and the list is empty.

Pause and resume the history:

1. User clicks "Pause watch history" on the right.
2. A confirmation modal explains that, while paused, watched videos are not recorded and do not influence
   recommendations.
3. User confirms; the page shows that the history is paused, and the button becomes "Resume watch history".
4. Videos watched from then on are not added.
5. User clicks "Resume watch history", and recording starts again with the next video watched.

Branches:

* **Watching a video that is already in the history** — no second item is created; the existing one moves to the top
  with the new time.
* **A video in the history can no longer be watched** — it was deleted, or it was made private, which includes every
  video of a channel with a deletion scheduled ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)).
  The row stays in the history as a placeholder, the way YouTube shows such videos: a grey box instead of the
  thumbnail, "Private video" or "Deleted video" instead of the title, and no channel name or view count. It cannot be
  opened, and it can still be removed.
* **No history yet** — the page shows an empty state.
* **Nothing matches the search** — the list shows an empty state until the search is changed.
* **Cancelling a confirmation** — the modal closes and nothing changes.
* **The list fails to load** — a full-page error state with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Removing, clearing, pausing or resuming fails** — the default toast behaviour applies and nothing changes.

**Acceptance criteria**

* The sidebar has a "Watch history" item that opens the page.
* The page lists the videos the current channel has watched, most recently watched first, with page controls at the
  bottom — no infinite scroll.
* Each item shows the thumbnail, the title, the channel name, the view count and when it was watched.
* A video appears once, with the time it was last watched.
* The search bar finds videos whose title contains the query, and is submitted rather than filtering as the user types.
* Hovering over an item shows a delete button, always visible on mobile. Removing an item asks for confirmation and
  loads the list again afterwards.
* "Clear watch history" asks for confirmation and removes the entire history of the current channel.
* "Pause watch history" asks for confirmation; while paused, the page shows it, watched videos are not recorded, and
  watching does not influence recommendations.
* "Resume watch history" takes effect without a confirmation.
* Pausing the history does not stop views from being counted ([US-Videos-01](../videos/US-Videos-01-Watch-videos.md)).
* Removing an item or clearing the history also removes those videos' watch signals from the recommendations.
* A video that can no longer be watched keeps its row in the history, shown as a placeholder — a grey box instead of
  the thumbnail and "Private video" or "Deleted video" instead of the title — rather than removed from the list; the
  row can still be deleted by the user like any other.
* Failures to load the list are shown as a full-page error; failures of an action are shown as a toast.

**Tech notes**

* The history is written from the `VideoViewed` event that the watch endpoint emits
  ([US-Videos-01](../videos/US-Videos-01-Watch-videos.md)) — from every watch, not from the deduplicated view count. A
  repeat watch has to move the video to the top even when it does not count as a new view.
* One row per channel and video, written as an upsert that only moves the watched time forward, with a unique constraint
  on the pair.
* Pausing is a flag on the channel. The watch event is still emitted, so views keep being counted; the history consumer
  and the consumer that feeds watches to the recommender both skip a paused channel. Both read the flag for every watch
  event, so keep it where that lookup is cheap, and cache it.
* **Decision: clearing does affect the feed.** Pausing exists precisely to keep watching out of the recommendations, and
  someone who clears their history expects the platform to forget it, not to keep recommending from it. Removing a
  single video does the same for that video. The Recommendations side receives an event for the clear or the removal
  and deletes those watch signals from Gorse
  ([US-Recommendations-01](../recommendations/US-Recommendations-01-Feed.md)); the feed changes once Gorse next
  refreshes its models, not immediately.
* **Decision: clearing is a single request, not a BullMQ job.** Deleting a channel's rows by an indexed channel id is
  fast for any realistic history. The slow part — cleaning up the recommender — already happens asynchronously through
  the event, so the request never waits for it. A background job becomes worth it only if one channel's history grows
  large enough that a single delete runs for long; at that point, delete in chunks from a job.
* The search is a plain substring match on the title, with no Elasticsearch. That needs the title in the same database
  as the history rows, so store it on the row and refresh it from the video-updated event — the same denormalisation
  already used for channel names. Filtering by channel first keeps the scan small; a `pg_trgm` index is the next step if
  it ever is not.
* **History rows outlive the videos they point at.** A video deletion does not remove them
  ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)); the row stays and is rendered as a placeholder, so a
  history keeps its shape instead of quietly losing entries. The placeholder shows "Deleted video" rather than the
  title stored on the row; the stored title is what keeps searching the history working over entries whose video is
  gone.
* Whether a row is still watchable is decided when the list is served, so a video made private — including one whose
  channel has a deletion scheduled — becomes a placeholder without anything being written.
* The paused state comes with the list response, so the button and the notice render correctly on the first paint.

**Links**

* [US-Recommendations-01 — Feed](../recommendations/US-Recommendations-01-Feed.md)
* [US-UI-UX-03 — Global layout](../ui-ux/US-UI-UX-03-Global-layout.md)
* [US-Videos-01 — Watch videos](../videos/US-Videos-01-Watch-videos.md)
* [US-Videos-03 — Manage own videos](../videos/US-Videos-03-Manage-own-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* [Task-01 — Create watch-history-api](../../tasks/my-activity/US-My-activity-01/backend/Task-01-Create-watch-history-api.md)
* [Task-02 — watch-history-api: Record watches from the viewed event](../../tasks/my-activity/US-My-activity-01/backend/Task-02-watch-history-api-Record-watches-from-the-viewed-event.md)
* [Task-03 — watch-history-api: Keep the stored titles fresh](../../tasks/my-activity/US-My-activity-01/backend/Task-03-watch-history-api-Keep-the-stored-titles-fresh.md)
* [Task-04 — video-api: Report video availability over gRPC](../../tasks/my-activity/US-My-activity-01/backend/Task-04-video-api-Report-video-availability-over-gRPC.md)
* [Task-05 — watch-history-api: Implement GET /watch-history](../../tasks/my-activity/US-My-activity-01/backend/Task-05-watch-history-api-Implement-GET-watch-history.md)
* [Task-06 — watch-history-api: Implement DELETE /watch-history/{videoId}](../../tasks/my-activity/US-My-activity-01/backend/Task-06-watch-history-api-Implement-DELETE-watch-history-videoId.md)
* [Task-07 — watch-history-api: Implement DELETE /watch-history](../../tasks/my-activity/US-My-activity-01/backend/Task-07-watch-history-api-Implement-DELETE-watch-history.md)
* [Task-08 — watch-history-api: Implement PUT /watch-history/paused](../../tasks/my-activity/US-My-activity-01/backend/Task-08-watch-history-api-Implement-PUT-watch-history-paused.md)
* [Task-09 — watch-history-api: Expose the paused flag over gRPC](../../tasks/my-activity/US-My-activity-01/backend/Task-09-watch-history-api-Expose-the-paused-flag-over-gRPC.md)
* [Task-10 — recommendation-api: Skip watches of paused channels](../../tasks/my-activity/US-My-activity-01/backend/Task-10-recommendation-api-Skip-watches-of-paused-channels.md)
* [Task-11 — recommendation-api: Forget removed and cleared watches](../../tasks/my-activity/US-My-activity-01/backend/Task-11-recommendation-api-Forget-removed-and-cleared-watches.md)

FE:

* [Task-12 — Build the watch history page](../../tasks/my-activity/US-My-activity-01/frontend/Task-12-Build-the-watch-history-page.md)
* [Task-13 — Remove a video from the history](../../tasks/my-activity/US-My-activity-01/frontend/Task-13-Remove-a-video-from-the-history.md)
* [Task-14 — Clear, pause and resume the history](../../tasks/my-activity/US-My-activity-01/frontend/Task-14-Clear-pause-and-resume-the-history.md)
