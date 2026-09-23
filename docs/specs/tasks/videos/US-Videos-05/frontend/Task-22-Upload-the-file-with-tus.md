## Upload the file with tus

Needs: [Task-21 — Implement the uploading page](Task-21-Implement-the-uploading-page.md),
[Task-06 — video-upload-api: Implement the tus hooks](../backend/Task-06-video-upload-api-Implement-the-tus-hooks.md)

Send the file with `tus-js-client` through the gateway's tus route, showing the percentage in the status box.

Main flow:

1. The transfer starts as soon as the page opens after a file is chosen.
2. While it runs, the page warns that closing the tab interrupts it.
3. When it finishes, the warning becomes a green alert saying the upload is complete and the user may leave and publish
   later.

Branch — the user comes back to an unfinished upload:

1. Choosing the same file resumes it from where it stopped, for up to a day.

Branch — the transfer fails:

1. The toast behaviour applies, and the upload can be resumed.

Why: a 10 GB limit and a browser tab that can close at any moment leave no realistic alternative to resumable uploads,
which is what tus is.
