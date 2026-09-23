## video-api: Implement GET /videos/{videoId}/watch

Needs: [US-Videos-05 Task-19 — video-api: Implement POST /videos/{videoId}/publish](../../US-Videos-05/backend/Task-19-video-api-Implement-POST-videos-videoId-publish.md),
[US-Channels-03 Task-03 — channel-api: Expose the age-restricted setting over gRPC](../../../channels/US-Channels-03/backend/Task-03-channel-api-Expose-the-age-restricted-setting-over-gRPC.md)

`GET /videos/{videoId}/watch`

Main flow:

1. Decide whether this viewer may watch: published, not private unless they are the author, and allowed by age.
2. Compute `expires` and the token, and return the playlist URL `/hls/{expires}/{token}/{videoId}/master.m3u8`, the
   previews VTT under the same prefix, the video's details, its counts and whether comments and rates are allowed.
3. Write the viewed event to the outbox, keyed by the video, carrying the acting channel, the user agent, the IP and
   the video's title — the watch history stores the title for its search
   ([US-My-activity-01](../../../../user-stories/my-activity/US-My-activity-01-Watch-history.md)).

Branch — the video is private and the viewer is not its author, or they are too young:

1. Refuse with the matching code; the page renders that state and loads nothing else.

Branch — the viewer is old enough but their channel has age-restricted content turned off:

1. Refuse with its own code, so the page can point at the setting rather than sounding like a refusal.

Branch — the video is still processing:

1. Return that state, with no playlist URL.

The token is `base64url(md5("{videoId}{expires} {secret}"))` — the space before the secret is part of the string, and
`expires` is in seconds ([hls-segment-protection.md](../../../../../explainers/hls-segment-protection.md), Part 8).
Make the expiry generous: if it lapses mid-playback the segments start returning 410, which looks like a broken player.

Why: this is the one permission check for the whole video. The gateway then validates every segment request by
recomputing that hash, with no call and no database lookup — about 150 of them for a 10-minute video.
