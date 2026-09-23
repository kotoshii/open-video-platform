## Show the theme toggle on pages without the layout

Needs: [US-UI-UX-01 Task-02 — Build the theme toggle](../../US-UI-UX-01/frontend/Task-02-Build-the-theme-toggle.md),
[_platform frontend Task-02 — Set up the route groups](../../../_platform/frontend/Task-02-Set-up-the-route-groups.md)

Add the controls in the top right corner of the layout for the route group with no navbar and no sidebar — the auth
pages, the channel selection page and the pages opened from email links. It holds the theme toggle, with a slot beside
it for the language selector ([US-I18n-01](../../../../user-stories/i18n/US-I18n-01-Language-selector.md)).

Why: those pages are used before anyone is signed in, so the two settings that live in the browser have to be reachable
from them too.
