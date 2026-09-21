## US-Videos-03 — Manage own videos

**Description**

As a registered user who has uploaded videos, I want to edit my videos, control who can see
them and delete them, so that I can keep my channel's content the way I want it.

**User flows**

Open the menu:

1. User opens their own channel page ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).
2. User hovers over the video they want to manage and the 3-dot button appears; on mobile it is always visible.
3. User clicks it.
4. A menu appears with three items: Edit, Change visibility, Delete.

Edit — main flow:

1. A modal opens with the video's current title, description, tags, the "Allow comments" and "Allow rates (likes /
   dislikes)" toggles, the thumbnail and the audience setting.
2. User changes what they want: the title, the description, adding or removing tags, turning comments or rates on or
   off, picking a different thumbnail or uploading their own, and whether the video is restricted to viewers over 18.
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

1. A confirmation modal appears, stating in plain words that the video, its files, its comments and all rates are
   **deleted permanently and immediately**, with no way to get them back. Buttons: "Cancel" (primary, left) and
   "Delete" (secondary, right).
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
* The same menu opens from an edit button under the player on the author's own video page
  ([US-Videos-01](./US-Videos-01-Watch-videos.md)), so managing a video does not require going back to the channel
  page.

Edit:

* The modal has the title, the description, the tags, an "Allow comments" toggle, an "Allow rates (likes / dislikes)"
  toggle, the thumbnail and the audience setting.
* The audience setting can be changed here, using the same yes-or-no question as on upload
  ([US-Videos-05](./US-Videos-05-Upload-videos.md)).
* Tags are shown as chips and can be removed individually.
* The thumbnail can be picked from the options generated for the video, or uploaded by the user.
* The title cannot be empty.
* Changes are applied only after "Save"; cancelling or closing discards them.
* The editing UI states clearly that changes may take a while to show up in search and the feed.
* Turning off comments hides the comment section on the video page and prevents new comments
  ([US-Comments-01](../comments/US-Comments-01-See-comments.md)).
* Turning off rates hides the like and dislike buttons on the video page and prevents new ones
  ([US-Videos-04](./US-Videos-04-Like-dislike-videos.md)).
* Neither deletes anything: turning comments or rates back on shows the existing ones again, as they were.

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
* The confirmation states plainly that the deletion is permanent and immediate: the video, its files, its comments and
  all rates are destroyed and cannot be recovered. There is no window and no undo.
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
* A thumbnail change goes out on the same video-updated event as any other edit. One event per edit keeps it simple;
  consumers that do not use the thumbnail, such as the search index, ignore the field.
* The title, description and tags are what similar videos are found from
  ([US-Recommendations-02](../recommendations/US-Recommendations-02-Similar-videos.md)), so editing them changes the
  similar videos as well as search — through the same re-index.
* The three visibility values already exist in the schema as `public`, `accessible_by_link` and `private`.
* Enforcement differs per value, and this is worth being explicit about: **private** is enforced on the watch path — the
  API refuses the video to anyone but the author. **Accessible by link** is enforced on the *listing* paths instead: the
  video must be excluded from the search index, from feed candidates and from the channel's video list, while the watch
  path treats it like a public video. Getting this wrong in one listing leaks the video.
* The purge has to remove more than the row: the whole S3 prefix (the original, the HLS playlist and segments, the MP4
  renditions and the thumbnails), the comments and replies on the video together with the rates on those comments, the
  rates on the video itself, and its entries in the search index and the recommender. That is a fan-out over Kafka with
  each service deleting what it owns, the same shape as channel deletion
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)), and every step has to be idempotent.
* Inside the comments service, deleting the comments and the rates on them is one local transaction — same database,
  so nothing has to be coordinated. The saga is the part that crosses services: the video service tells the comments,
  search, recommendation and my-activity services to remove what they own, and each reports back.
* **Watch history rows are not deleted with the video.** The row stays and renders as a placeholder saying the video is
  no longer available, so a viewer's history keeps its shape instead of silently losing entries
  ([US-My-activity-01](../my-activity/US-My-activity-01-Watch-history.md)). Rates are different: they are destroyed
  with the video, so the entry simply leaves the rated videos list
  ([US-My-activity-02](../my-activity/US-My-activity-02-Rated-videos.md)).
* **Deleting one video is a hard delete, applied immediately.** There is no soft-deleted state and no window: the
  10-second confirmation is the whole guard, which is why the modal has to say outright that this is permanent. A
  window belongs to deleting a channel, where a single action takes everything at once
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)); one video the author chose deliberately does
  not need one.
* The files are large, so the removal from S3 may be better done by a background job than inside the request — the row
  and the listings can go immediately while the bytes follow.
* Turning comments or rates off **hides them and deletes nothing**. The existing comments and rates stay in their
  databases, and turning the setting back on shows them exactly as they were — so this is a flag checked when serving
  and when writing, not a cleanup.
* The audience setting is first chosen on upload ([US-Videos-05](./US-Videos-05-Upload-videos.md)) and can be changed
  here. It is enforced on the watch path ([US-Videos-01](./US-Videos-01-Watch-videos.md)), so restricting a video takes
  effect for viewers straight away — but the search index stores the flag too, so the change has to be re-indexed like
  any other edit.

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
