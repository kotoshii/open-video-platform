## Collapse and expand the sidebar on desktop

Needs: [Task-02 — Build the sidebar navigation](Task-02-Build-the-sidebar-navigation.md)

Main flow:

1. User clicks the menu button in the navbar.
2. The sidebar collapses: the channel avatar on top and one icon per item, without names.
3. Hovering an icon shows that item's name.
4. Clicking the menu button again expands it.

Keep whether it is collapsed in a cookie, and render the sidebar on the server from that cookie.

Why: localStorage cannot be read while the page renders on the server, so the sidebar would come back expanded and jump
once the browser corrected it — the same problem as the flash of the wrong theme.
