## Show failed actions as toasts

Needs: [Task-01 — Add the error state components](Task-01-Add-the-error-state-components.md)

Show a toast when an action the user took fails — posting a comment, rating, deleting, saving settings. Wire it once in
the query client's mutation error handling, so a feature gets it without doing anything.

Main flow:

1. A mutation fails.
2. A toast shows the message for that error.
3. The user stays on the page, with what they typed still there.

Branch — the error carries field-level errors:

1. The form shows them under their fields, and no toast appears.

Branch — the failure is a page or a section loading its data:

1. No toast. Those show the error states from Task-01, since a toast over an empty page leaves nothing to look at.

Why: wiring it once in the query client is what makes "no silent failures" true by default instead of per feature.
