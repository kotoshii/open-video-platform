## Build the player

Needs: [Task-04 — Build the video page layout](Task-04-Build-the-video-page-layout.md)

Put Plyr with `hls.js` in the page, playing the playlist URL the watch endpoint returned, and wire up what the platform
supports: play and pause, seeking, the preview images while seeking, quality, playback speed, picture-in-picture and
fullscreen. Autoplay is off.

* The preview images come from the WEBVTT file under the video's own prefix, which Plyr reads directly.
* `hls.js` picks the rendition by itself; the quality control overrides that choice rather than replacing it.

Branch — the master playlist gains a quality while the page is open:

1. Nothing special happens: the player works with whatever the playlist offered when it loaded.

Why: a video can be published once one quality exists, so the ladder the player sees is whatever has finished so far.
