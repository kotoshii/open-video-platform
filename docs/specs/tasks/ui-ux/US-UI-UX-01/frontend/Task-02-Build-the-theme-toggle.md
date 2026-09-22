## Build the theme toggle

Needs: [Task-01 — Add dark theme support to the app](Task-01-Add-dark-theme-support-to-the-app.md),
[US-I18n-01 Task-02 — Set up the i18n library](../../../i18n/US-I18n-01/frontend/Task-02-Set-up-the-i18n-library.md)

Build the control that switches between light and dark: an icon button showing which theme is on. The layout places it —
in the sidebar, and in the top right corner on pages that have no sidebar
([US-UI-UX-03](../../../../user-stories/ui-ux/US-UI-UX-03-Global-layout.md)).

Main flow:

1. The app starts in the system's theme.
2. User clicks the toggle.
3. The whole interface switches to the other theme straight away.
4. The choice is stored, and the system preference is not followed from then on.

Every string, the button's accessible label included, goes through the i18n library
([US-I18n-01](../../../../user-stories/i18n/US-I18n-01-Language-selector.md)).

Why: two states rather than three — the system preference is where the app starts, not something the user has to pick
from a list.
