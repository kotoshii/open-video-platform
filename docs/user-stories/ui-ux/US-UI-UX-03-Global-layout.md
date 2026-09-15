## US-UI-UX-03 — Global layout

**Description**

As a registered user with a verified account, I want every page of the app to share the same navbar and sidebar, so
that search and navigation are always one click away, wherever I am.

The layout belongs to the part of the app that can actually be used. Signing in is required to use the app, so the auth
pages — where it cannot be used yet — have neither the navbar nor the sidebar. Search is part of the app's primary
functionality, which is why it goes wherever the layout goes.

**User flows**

Move around the app — main flow:

1. User opens any page that requires being signed in.
2. At the top, the navbar holds the search bar ([US-Search-01](../search/US-Search-01-Search-videos.md)) and, on desktop,
   the "Upload" button ([US-Videos-05](../videos/US-Videos-05-Upload-videos.md)).
3. On the left, the sidebar holds the current channel and the navigation.
4. User clicks a sidebar item and its page opens; the item for the current page is highlighted.

Collapse and expand the sidebar — desktop:

1. User clicks the menu button at the left of the navbar.
2. The sidebar collapses: only the channel avatar on top and an icon for each item remain, without names.
3. Hovering over an icon shows the item's name.
4. Clicking the menu button again expands the sidebar back to the avatar with the channel name, and icons with item
   names.

Open the sidebar — mobile:

1. The navbar shows the menu button and the search bar, and no "Upload" button.
2. User taps the menu button.
3. The sidebar opens as a full-screen drawer, with a back arrow next to the logo at the top.
4. Tapping an item opens its page and closes the drawer; the back arrow closes the drawer without navigating.

Branches:

* **Auth pages** — log in, sign up ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)), account
  confirmation ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)) and password reset
  ([US-Auth-03](../auth/US-Auth-03-Password-reset.md)) show neither the navbar nor the sidebar.
* **Pages opened from an email link** — the same rule applies: a page that has to work without the user being signed
  in, such as the confirmation page after changing the email or the password, has no layout.

**Acceptance criteria**

Where it appears:

* Every page that requires being signed in shows the navbar at the top and the sidebar on the left.
* Pages that can be used without being signed in — the auth pages, and email-link pages that ask the user to sign in —
  show neither.
* Those pages still show the language selector and the theme toggle, in the top right corner.

Navbar:

* The navbar holds the search bar on every page it appears on.
* On desktop the navbar also holds the menu button, on its left, and the "Upload" button.
* On mobile the navbar holds the menu button and the search bar only.

Sidebar:

* From top to bottom the sidebar contains:
    * the logo;
    * the current channel — its avatar and name, with the arrow that opens the channel switcher
      ([US-Channels-01](../channels/US-Channels-01-create-multiple-channels.md),
      [US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)); clicking the name opens the
      channel's page ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md));
    * a divider;
    * Homepage;
    * Subscriptions;
    * Notifications, with its unread badge
      ([US-Notifications-02](../notifications/US-Notifications-02-In-app-channel.md));
    * Watch history;
    * Liked videos;
    * My comments — these three have no stories yet (My activity epic);
    * Settings ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md));
    * on mobile only, a divider followed by "Upload" ([US-Videos-05](../videos/US-Videos-05-Upload-videos.md)).
* Pinned to the bottom of the sidebar, in this order:
    * the language selector ([US-I18n-01](../i18n/US-I18n-01-Language-selector.md));
    * the theme toggle ([US-UI-UX-01](./US-UI-UX-01-Dark-theme-support.md));
    * a divider;
    * "Log out", styled as destructive (red), which asks for confirmation before logging the user out
      ([US-Auth-06](../auth/US-Auth-06-Logging-out.md)).
* The item for the current page is highlighted.

Collapsed sidebar — desktop:

* The sidebar can be collapsed and expanded with the menu button in the navbar.
* Expanded, it shows the channel avatar with the channel name, and every item as an icon with its name.
* Collapsed, it shows only the channel avatar and every item as an icon.
* In the collapsed sidebar, hovering over an icon shows the item's name, and the unread notifications badge stays
  visible on its icon.
* Whether the sidebar is collapsed is remembered across page reloads.

Sidebar drawer — mobile:

* The menu button opens the sidebar as a full-screen drawer, with a back arrow next to the logo.
* Choosing an item opens its page and closes the drawer; the back arrow closes the drawer without navigating.
* The page behind the drawer does not scroll while the drawer is open.

**Tech notes**

* The navbar and the sidebar are one shared shell around every signed-in page, and the auth pages sit outside it.
  Deciding that by route group — one group with the layout, one without — rather than page by page means a new page
  cannot forget the navbar or show it by accident. Next.js route groups do exactly this.
* A shared layout is not re-rendered when moving between pages inside the app. That is why anything living in it only
  refreshes on a page load — the unread notifications badge is deliberately one of those
  ([US-Notifications-02](../notifications/US-Notifications-02-In-app-channel.md)).
* The collapsed state must not make the sidebar jump when the page loads — the same problem as the flash of the wrong
  theme ([US-UI-UX-01](./US-UI-UX-01-Dark-theme-support.md)). localStorage is not readable during server rendering, so
  keeping the state in a cookie lets the server render the sidebar the right way from the start.
* Some mockups still show "Account Settings" and lack the Notifications and My comments items; the structure above
  supersedes them.

**Links**

* [US-Auth-06 — Logging out](../auth/US-Auth-06-Logging-out.md)
* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Notifications-02 — In-app notifications](../notifications/US-Notifications-02-In-app-channel.md)
* [US-Search-01 — Search videos](../search/US-Search-01-Search-videos.md)
* [US-UI-UX-01 — Dark theme support](./US-UI-UX-01-Dark-theme-support.md)
* [US-Videos-05 — Upload videos](../videos/US-Videos-05-Upload-videos.md)

**Tasks**

FE:

* TODO
