## Implement the file selection page

Needs: [Task-05 — video-upload-api: Implement POST /video-uploads/initialize](../backend/Task-05-video-upload-api-Implement-POST-video-uploads-initialize.md),
[US-UI-UX-03 Task-01 — Build the app shell layout](../../../ui-ux/US-UI-UX-03/frontend/Task-01-Build-the-app-shell-layout.md)

Build the page the "Upload" button opens, inside the layout: a drag-and-drop area on desktop, a "Select" button on
mobile. The area states the supported formats and the 10 GB limit, and the text under it explains what comes next —
details, a thumbnail chosen or uploaded, and that the video stays invisible to everyone until processing finishes and
the author publishes it.

Also add the "Upload" button itself: in the navbar on desktop, and as the last sidebar item on mobile.

Main flow:

1. User drops or picks a file.
2. The app initialises the upload and goes to that video's uploading page, where the transfer starts.

Branch — the file is not a supported video, or is too large:

1. A readable message, and nothing is uploaded.

Why: the limits are checked here so a 10 GB transfer never starts for a file the server would refuse anyway.
