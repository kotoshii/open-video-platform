## Add the video id to the view dedup key

Build the view reservation key in `video-view-count-worker` from the video id and the viewer —
`video-view:<videoId>:<viewerId>` — so a viewer is counted once per video per 24 hours instead of once overall. Drop the
`btoa` around the ids; ids are already safe as key segments.

Why: the key has no video id today, so watching one video stops the viewer's views of every other video from being
counted until the key expires ([known-issues.md](../../../../known-issues.md)).
