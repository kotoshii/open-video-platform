## US-Videos-04 — Like/dislike videos

**Description**

As a registered user, I want to like or dislike a video, so that I can show what I think of it
and help other people see how it was received.

**User flows**

Rate a video — main flow:

1. User opens a video page by clicking a video item on some page ([US-Videos-01](./US-Videos-01-Watch-videos.md)).
2. Under the player, user sees the like and dislike buttons with their counts, and a bar underneath showing the
   proportion of likes to dislikes.
3. User clicks either of them.
4. The button becomes active straight away, before the server answers. The counts next to it stay as they are.
5. The rate is recorded for the channel the user is currently acting as.

Rate a video — branches:

* **Removing a rate** (step 3) — clicking the active button again removes the rate, and the button goes inactive.
* **Changing a rate** (step 3) — clicking the opposite button moves the rate, and the active state moves to that
  button.
* **Reloading the page** (after step 5) — the user's own rate is still shown as active; the counts are the stored ones,
  which include the new rate once it has been applied.
* **No rates yet** (step 2) — no number is shown next to either button, and the bar is in a neutral state.
* **Request fails** (step 5) — the button returns to its previous state, and a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Rates turned off for the video** (step 2) — the author disabled them
  ([US-Videos-03](./US-Videos-03-Manage-own-videos.md)); neither the buttons nor the bar are rendered.

**Acceptance criteria**

* The video page has a like button and a dislike button under the player, each with its count, and a ratio bar beneath
  them.
* A count of zero is not shown: a video with no likes shows the like button without a number, and the same for
  dislikes.
* The buttons show whether the current channel has already liked or disliked this video.
* Clicking an inactive button records the rate, clicking the active one removes it, and clicking the opposite one
  switches it.
* A video can be either liked or disliked by a channel, never both at once.
* The button state changes immediately, before the server confirms, and is still shown after a page reload.
* The counts are always the stored ones and are not adjusted on the client — the button state is what confirms the
  action. A new rate shows up in the count once it has been applied, the next time the page loads.
* A failed request reverts the button.
* The ratio bar shows the share of likes among all rates on the video, and is drawn from the same stored numbers as the
  counts.
* A video with no rates at all shows the bar in a neutral state, rather than as fully liked or fully disliked.
* When the author has turned rates off, neither the buttons nor the ratio bar are shown.

**Tech notes**

* A rate belongs to a channel and a video, and the rater is the acting channel
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)), so one account can rate the same
  video differently from each of its channels.
* The current channel's own rate is read straight from the video rate API — one indexed lookup by channel and video,
  cheap enough to do on every page load. That is what keeps the button state correct after a reload.
* Counts on the video row are maintained by the `video-rate-count-worker`, which applies rate events in Kafka batches.
  They are eventually consistent, so right after someone rates a video the stored number is still the old one.
* **The counts are not adjusted on the client.** Keeping the number in step with the user's click — including across
  reloads — was considered and dropped: the active button already tells the user their click worked, and matching the
  number as well is extra work for very little benefit.
* Hiding a zero count is what removes the one case that would look broken: "0" next to a button the user has just
  activated. A button with no number next to it does not read as a failure.
* Anything that ranks or sorts by rates reads the stored count, so it lags — the same trade-off already accepted for
  subscriber counts in channel search and for comment rates.
* When rates are turned off for a video, the API must reject new ones as well; hiding the buttons is not the
  enforcement.
* A user can rate only a video they are allowed to watch, by the same rules as
  [US-Videos-01](./US-Videos-01-Watch-videos.md). The API refuses a rate on any other video, or on one that does not
  exist.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=18-722&p=f&t=0uaBWT7mgjLi4HBf-0)
* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-06 — Like/dislike comments and replies](../comments/US-Comments-06-Like-dislike-comments.md)
* [US-Videos-01 — Watch videos](./US-Videos-01-Watch-videos.md)
* [US-Videos-03 — Manage own videos](./US-Videos-03-Manage-own-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* [Task-01 — Migrate video-rate-count-worker to the new structure](../../tasks/videos/US-Videos-04/backend/Task-01-Migrate-video-rate-count-worker-to-the-new-structure.md)
* [Task-02 — video-api: Expose a video's rate permission over gRPC](../../tasks/videos/US-Videos-04/backend/Task-02-video-api-Expose-a-videos-rate-permission-over-gRPC.md)
* [Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](../../tasks/videos/US-Videos-04/backend/Task-03-video-rate-api-Implement-POST-video-rates-videoId.md)
* [Task-04 — video-rate-api: Implement DELETE /video-rates/{videoId}](../../tasks/videos/US-Videos-04/backend/Task-04-video-rate-api-Implement-DELETE-video-rates-videoId.md)
* [Task-05 — video-rate-api: Implement GET /video-rates/{videoId}](../../tasks/videos/US-Videos-04/backend/Task-05-video-rate-api-Implement-GET-video-rates-videoId.md)
* [Task-06 — video-rate-count-worker: Apply the rate counts](../../tasks/videos/US-Videos-04/backend/Task-06-video-rate-count-worker-Apply-the-rate-counts.md)

FE:

* [Task-07 — Add the rate buttons to the video page](../../tasks/videos/US-Videos-04/frontend/Task-07-Add-the-rate-buttons-to-the-video-page.md)
