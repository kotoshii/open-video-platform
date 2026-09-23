## video-api: Report video availability over gRPC

Needs: [US-Search-01 Task-04 — video-api: Look up the visible videos over gRPC](../../../search/US-Search-01/backend/Task-04-video-api-Look-up-the-visible-videos-over-gRPC.md)

Add the gRPC method the viewer's own lists use — the watch history, rated videos and My comments. It takes a list of
video ids and the acting channel, and answers for every id:

* **available**, with the card fields the listing lookup returns;
* **private** — private or not yet published, and the viewer is not its author;
* **deleted** — there is no such video.

Age is not checked here: an age-blocked video shows as a normal row, and opening it shows the video page's blocked
state. An accessible-by-link video is available, as it is on the watch path.

Why: the listing lookup answers "may this appear in a list for this viewer" and silently drops what may not. These
lists need the opposite: every row stays, and only the reason a video cannot be opened changes how it is drawn — so it
is a different question, and a different method.
