## US-UI-UX-02 — User-friendly error messages

**Description**

As any user, I want to see clear, readable messages when something goes wrong, so that I understand what happened and
what I can do next, instead of facing a blank page or a stack trace.

**User flows**

Failed API request:

1. User performs an action that requires an API request.
2. The request fails.
3. The app shows a readable error message describing what went wrong.
4. If the action can be retried, the user retries it.

Failed page data loading:

1. User opens a page that loads its data by ID (video, channel, etc.).
2. The request fails.
3. The app shows a full-screen error message in place of the page content.
4. The user retries loading or navigates away.

Client-side exception:

1. User performs a client-side action that throws an unhandled exception.
2. The nearest error boundary catches it.
3. The app shows an error screen (or replaces the broken section with an error state) instead of crashing.
4. The user reloads the page or navigates away.

**Acceptance criteria**

* Every failed API request produces a visible error message — no silent failures.
* Error messages are written for humans: no stack traces, raw exception text, or internal implementation details.
* Errors that occur during an action (submit, like, delete, etc.) are shown as a toast/notification; the user stays on
  the page.
* Errors that occur while loading page data are shown as a full-screen message in place of the content.
* Data-loading sections have their own error state with a retry button; a failure in one section does not break the rest
  of the page.
* Sections that cannot be retried show a message asking the user to reload the page.
* The app is wrapped in a top-level error boundary — an unhandled client-side exception never leaves a blank page.
* All error messages are localizable (see the I18n epic).

**Tech notes**

* Two reusable error-state components are needed: one with a retry action, one without (reload the page).
* API error responses should carry a code the client can map to a localized message, with a generic fallback for unknown
  codes.

**Tasks**

FE:

* TODO