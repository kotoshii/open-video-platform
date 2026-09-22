## Build the search input in the navbar

Needs: [US-UI-UX-03 Task-01 — Build the app shell layout](../../../ui-ux/US-UI-UX-03/frontend/Task-01-Build-the-app-shell-layout.md)

Fill the navbar's search slot: the input with two icon buttons inside it on the right — one opening the filters and
sorting, one toggling between video and channel search. The toggle starts on videos, its icon shows the current mode,
and the placeholder says which is being searched.

Main flow:

1. The filters open as a popup on desktop and a bottom drawer on mobile: Upload date, Duration and Order, laid out as
   three columns on desktop and as chips on mobile.
2. No filter is selected by default and the order is Relevancy.
3. A selected option shows an × that removes it, and "Clear filters" removes them all, leaving the order alone.
4. Enter or the search button opens the search page with the query, the filters and the order in its address.

Branch — the query is empty:

1. Nothing is submitted and the user stays where they are.

Why: everything that shapes the results lives in the URL, so reloading the page or sharing the link reproduces them.
