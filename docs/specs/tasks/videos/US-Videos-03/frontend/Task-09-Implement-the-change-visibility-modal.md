## Implement the change visibility modal

Needs: [Task-03 — video-api: Implement PUT /videos/{videoId}/visibility](../backend/Task-03-video-api-Implement-PUT-videos-videoId-visibility.md),
[Task-07 — Build the video management menu](Task-07-Build-the-video-management-menu.md)

Open a modal from "Change visibility" with the three options — Public, Accessible by link, Private — the current one
selected, and a hint under them explaining what the selected option means.

Main flow:

1. User picks an option and saves; the modal closes and the video shows its new state.

Branch — the user cancels:

1. The visibility is unchanged.

Why: the hint changes with the selection because the three options differ in where the video disappears from — the
watch page, or every listing — and that is not obvious from their names.
