## Add the email language setting to the Account tab

Needs: [Task-02 — Store and change the account's email language](../backend/Task-02-Store-and-change-the-accounts-email-language.md),
[US-I18n-01 Task-02 — Set up the i18n library](../../US-I18n-01/frontend/Task-02-Set-up-the-i18n-library.md)

Add the email language setting to the Account tab of the settings page
([US-Channels-03](../../../../user-stories/channels/US-Channels-03-current-channel-settings.md)), with a Save of its
own, like the other settings on that tab.

Main flow:

1. The tab loads the account and shows its current email language.
2. User picks another supported language, listed by its own name, and saves.
3. A success toast confirms it, and every email sent from then on is written in that language.

Branch — saving fails:

1. The default toast behaviour applies and the stored language stays as it was.

Why: this one is stored with the account, while the interface language lives only in the browser — which is why they are
two settings in two different places, and why switching the interface language shows a toast pointing here.
