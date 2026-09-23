## Switch the current channel from the switcher

Needs: [Task-01 — Store the current channel and send it with requests](Task-01-Store-the-current-channel-and-send-it-with-requests.md),
[US-Channels-01 Task-04 — Build the channel block and switcher](../../US-Channels-01/frontend/Task-04-Build-the-channel-block-and-switcher.md)

Main flow:

1. User opens the switcher and clicks another channel.
2. The app stores it as the current one and reloads the page.

Branch — the user clicks the channel they are already acting as:

1. The switcher closes and nothing else happens.

Why: switching issues no new token — the token lists every channel the account owns, and the header decides which one
is acting — so the reload is only there to re-render everything that depends on the channel.
