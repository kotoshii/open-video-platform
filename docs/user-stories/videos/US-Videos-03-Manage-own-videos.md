## US-Videos-03 — Manage own videos

**Description**

As a registered user with a verified account who has uploaded videos, I want to edit my videos, control who can see
them and delete them, so that I can keep my channel's content the way I want it.

**User flows**

Open the menu:

1. User opens their own channel page ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).
2. User hovers over the video they want to manage and the 3-dot button appears; on mobile it is always visible.
3. User clicks it.
4. A menu appears with three items: Edit, Change visibility, Delete.

Edit — main flow:

1. A modal opens with the video's current title, description, tags, the "Allow comments" and "Allow rates (likes /
   dislikes)" toggles, and the thumbnail.
2. User changes what they want: the title, the description, adding or removing tags, turning comments or rates on or
   off, picking a different thumbnail or uploading their own.
3. User clicks "Save".
4. The details are saved and the modal closes.
5. The video item in the list reflects the change immediately.

Edit — branches:

* **Cancel or close** (step 3) — the modal closes and nothing is saved.
* **Empty title** (step 3) — the field shows a validation error and nothing is sent.
* **Request fails** (step 4) — the default toast behaviour applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)) and the modal stays open with the entered values.

Change visibility — main flow:

1. A modal opens with three options: Public, Accessible by link, Private.
2. The video's current setting is selected.
3. Under the row of options, a hint explains what the selected one means.
4. User selects the option they want.
5. User clicks "Save".
6. The visibility is updated and the modal closes.

Change visibility — branches:

* **Cancel or close** (step 5) — the modal closes and the visibility is unchanged.
* **Request fails** (step 6) — the default toast behaviour applies and the modal stays open.

Delete — main flow:

1. A confirmation modal appears. Buttons: "Cancel" (primary, left) and "Delete" (secondary, right).
2. The "Delete" button stays disabled for 10 seconds to prevent accidental clicks.
3. User clicks "Delete".
4. The video is deleted and the modal closes.
5. The video disappears from the list.

Delete — branches:

* **Cancel** (step 3) — the modal closes and nothing happens.
* **Request fails** (step 4) — the default toast behaviour applies and the video stays.

**Acceptance criteria**

Menu:

* The 3-dot button is shown only on the user's own videos — on hover on desktop, always on mobile.
* The menu has exactly three items: Edit, Change visibility, Delete.

Edit:

* The modal has the title, the description, the tags, an "Allow comments" toggle, an "Allow rates (likes / dislikes)"
  toggle and the thumbnail.
* Tags are shown as chips and can be removed individually.
* The thumbnail can be picked from the options generated for the video, or uploaded by the user.
* The title cannot be empty.
* Changes are applied only after "Save"; cancelling or closing discards them.
* The editing UI states clearly that changes may take a while to show up in search and the feed.
* Turning off comments hides the comment section on the video page and prevents new comments
  ([US-Comments-01](../comments/US-Comments-01-See-comments.md)).
* Turning off rates hides the like and dislike buttons on the video page and prevents new ones
  ([US-Videos-04](./US-Videos-04-Like-dislike-videos.md)).

Change visibility:

* The modal offers Public, Accessible by link and Private, with the current setting selected.
* A hint under the options explains what the selected one means.
* **Public** — the video can be watched and found by anyone.
* **Accessible by link** — anyone with the link can watch it, but it does not appear in search, the feed or the
  channel's video list.
* **Private** — only the author can watch it.
* The change takes effect for other users without them reloading anything they had not already loaded.

Delete:

* Deleting requires a confirmation, with the confirm button disabled for 10 seconds.
* The confirmation states that the video and everything attached to it are removed.
* After a deletion the video is gone from the channel, from search and from the feed.

All three:

* Failures follow the default toast behaviour and leave the video as it was.
* When a change affects the video list — title, visibility or deletion — the list is updated on the client rather than
  reloaded in full.

**Tech notes**

* Editing, changing visibility and deleting all emit events, so the Search index
  ([US-Search-01](../search/US-Search-01-Search-videos.md)) and the recommender
  ([US-Recommendations-01](../recommendations/US-Recommendations-01-Feed.md)) can update their copies. Re-indexing is
  asynchronous, which is exactly why the UI has to warn about the delay rather than pretend the change is instant.
* A thumbnail change probably does not need re-indexing — the search index does not rank on it — but the video list and
  the feed cache do show it, so decide whether it rides along on the same event or is handled separately.
* Tags are what content-based similar videos are built from
  ([US-Recommendations-02](../recommendations/US-Recommendations-02-Similar-videos.md)), so editing them changes
  recommendations, not only search.
* The three visibility values already exist in the schema as `public`, `accessible_by_link` and `private`.
* Enforcement differs per value, and this is worth being explicit about: **private** is enforced on the watch path — the
  API refuses the video to anyone but the author. **Accessible by link** is enforced on the *listing* paths instead: the
  video must be excluded from the search index, from feed candidates and from the channel's video list, while the watch
  path treats it like a public video. Getting this wrong in one listing leaks the video.
* Deleting a video has to remove more than the row: the HLS playlist and segments, the MP4 renditions, the thumbnails,
  the comments and the rates, plus its entries in the search index and the recommender. That is a fan-out over Kafka
  with each service deleting what it owns, the same shape as channel deletion
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)), and every step has to be idempotent.
* Whether a deleted video is soft or hard deleted needs a decision. There is no restore flow here, unlike channels and
  accounts, which points at a hard delete — but the files are large, so the actual removal from S3 may be better done
  by a background job than inside the request.
* Turning comments or rates off raises a question the mockups do not answer: whether the existing comments and rates are
  hidden or simply frozen. Both are defensible; it needs a decision.
* Nothing here sets the age restriction, although the schema has an NSFW flag and the watch path enforces it
  ([US-Videos-01](./US-Videos-01-Watch-videos.md)). If it is not set during upload, there is currently no way to set it
  at all.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=43-509&p=f&t=0uaBWT7mgjLi4HBf-0)
* [US-Channels-04 — See own and other channels](../channels/US-Channels-04-see-own-and-other-channels.md)
* [US-Recommendations-02 — Similar videos](../recommendations/US-Recommendations-02-Similar-videos.md)
* [US-Search-01 — Search videos](../search/US-Search-01-Search-videos.md)
* [US-Videos-01 — Watch videos](./US-Videos-01-Watch-videos.md)
* [US-Videos-04 — Like/dislike videos](./US-Videos-04-Like-dislike-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
