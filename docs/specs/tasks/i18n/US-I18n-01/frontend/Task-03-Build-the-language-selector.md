## Build the language selector

Needs: [Task-02 — Set up the i18n library](Task-02-Set-up-the-i18n-library.md),
[US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md),
[US-UI-UX-03 Task-05 — Show the theme toggle on pages without the layout](../../../ui-ux/US-UI-UX-03/frontend/Task-05-Show-the-theme-toggle-on-pages-without-the-layout.md)

Build the selector and its modal, and put it in the two slots the layout leaves for it: in the sidebar, above the theme
toggle, and in the top right corner on pages without the layout.

Main flow:

1. On desktop the button shows a language icon and the current language's name; in the collapsed sidebar and on mobile,
   the icon alone.
2. Clicking it opens a modal in the middle of the screen, on desktop and mobile alike, listing every language by its own
   name — "English", "Українська".
3. The modal says that changing the language reloads nothing and interrupts nothing in progress, an upload included.
4. User picks a language, the modal closes, and the interface switches straight away.
5. An info toast says that emails have a language of their own, set in the settings
   ([US-I18n-03](../../../../user-stories/i18n/US-I18n-03-Localized-emails.md)).

Branch — the modal is closed without a choice:

1. Nothing changes.

Branch — the selector on a page without the layout:

1. No toast, since nobody is signed in there to have an email language.

Why: languages are listed by their own names so that someone can find theirs while the interface is in a language they
cannot read.
