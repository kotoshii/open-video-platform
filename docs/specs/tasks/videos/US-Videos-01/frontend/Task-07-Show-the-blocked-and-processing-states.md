## Show the blocked and processing states

Needs: [Task-04 — Build the video page layout](Task-04-Build-the-video-page-layout.md)

Render the states where the page shows one message and loads nothing else — no player, no details, no comments, no
similar videos.

Branch — the video is still processing:

1. Say so; the author's own upload page is where the progress is.

Branch — the video is private, or the viewer is too young for it:

1. Say that it cannot be watched.

Branch — the viewer is old enough but has age-restricted content turned off:

1. Say so and point at the setting, since this one is the viewer's own choice rather than a refusal.

Branch — the video does not exist:

1. Say that it is no longer available. This is not an error: notifications and emails can link to a video deleted
   since ([US-Notifications-02](../../../../user-stories/notifications/US-Notifications-02-In-app-channel.md)).

Branch — loading it failed:

1. A full-page error state.

Why: the server decides all of this in the watch request and the page renders only what it was given, so a blocked
video never loads its comments or its similar videos on the side.
