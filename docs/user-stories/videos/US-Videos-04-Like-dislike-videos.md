## US-Videos-04 — Like/dislike videos

**Description**

As a registered user with a verified account, I want to like or dislike a video, so that I can show what I think of it
and help other people see how it was received.

**User flows**

Rate a video — main flow:

1. User opens a video page by clicking a video item on some page ([US-Videos-01](./US-Videos-01-Watch-videos.md)).
2. Under the player, user sees the like and dislike buttons with their counts, and a bar underneath showing the
   proportion of likes to dislikes.
3. User clicks either of them.
4. The button state and the count update immediately, before the server answers.
5. The rate is recorded for the channel the user is currently acting as.

Rate a video — branches:

* **Removing a rate** (step 3) — clicking the active button again removes the rate; the button goes inactive and the
  count goes back down.
* **Changing a rate** (step 3) — clicking the opposite button moves the rate: one count goes down and the other goes
  up.
* **Reloading the page** (after step 5) — the user still sees their own rate and a count that includes it, even though
  the stored count has not caught up yet.
* **Viewing as another channel** — a channel that did not rate the video sees the stored count, without that
  adjustment.
* **Request fails** (step 5) — the button and the count return to what they were, and a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Rates turned off for the video** (step 2) — the author disabled them
  ([US-Videos-03](./US-Videos-03-Manage-own-videos.md)); neither the buttons nor the bar are rendered.

**Acceptance criteria**

* The video page has a like button and a dislike button under the player, each with its count, and a ratio bar beneath
  them.
* The buttons show whether the current channel has already liked or disliked this video.
* Clicking an inactive button records the rate, clicking the active one removes it, and clicking the opposite one
  switches it.
* A video can be either liked or disliked by a channel, never both at once.
* The button state and the count update immediately, before the server confirms.
* After a page reload the user still sees their own rate, and a count that includes it, even while the stored count is
  behind.
* A channel that has not rated the video sees the stored count, with no adjustment applied.
* A failed request reverts both the button and the count.
* The ratio bar shows the share of likes among all rates on the video, and is drawn from the same numbers shown next to
  the buttons.
* A video with no rates at all shows the bar in a neutral state, rather than as fully liked or fully disliked.
* When the author has turned rates off, neither the buttons nor the ratio bar are shown.

**Tech notes**

* A rate belongs to a channel and a video, and the rater is the acting channel
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)), so one account can rate the same
  video differently from each of its channels.
* The current channel's own rate is read straight from the video rate API — one indexed lookup by channel and video,
  cheap enough to do on every page load. That is what makes the button state survive a reload.
* Counts on the video row are maintained by the `video-rate-count-worker`, which applies rate events in Kafka batches.
  They are eventually consistent, so right after someone rates a video the stored number is still the old one.
* **Keeping a fresh rate visible is done on the client, not on the server.** When the user rates, the client stores the
  base count it was showing together with the delta it applied, keyed by channel and video. On render it compares: if
  the stored count still equals that base, it shows base plus delta; as soon as the stored count differs — the worker
  flushed, or somebody else rated — the local record is dropped and the server value is shown as is. This is
  self-correcting and cannot drift into double counting.
* That record has to survive a reload, so it lives in localStorage rather than in component state — the same place the
  current channel is kept.
* Being per browser and per channel is the intent, not a limitation: the same account acting as a different channel
  sees the real stored number.
* The point of all this is the small-numbers case. A video with 0 likes that stays at 0 for minutes after the user
  liked it reads as broken; at 43M nobody would notice either way.
* Anything that ranks or sorts by rates reads the stored count, so it lags — the same trade-off already accepted for
  subscriber counts in channel search and for comment rates.
* When rates are turned off for a video, the API must reject new ones as well; hiding the buttons is not the
  enforcement.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=18-722&p=f&t=0uaBWT7mgjLi4HBf-0)
* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-06 — Like/dislike comments and replies](../comments/US-Comments-06-Like-dislike-comments.md)
* [US-Videos-01 — Watch videos](./US-Videos-01-Watch-videos.md)
* [US-Videos-03 — Manage own videos](./US-Videos-03-Manage-own-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
