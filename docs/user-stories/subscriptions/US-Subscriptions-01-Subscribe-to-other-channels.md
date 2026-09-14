## US-Subscriptions-01 — Subscribe to other channels

**Description**

As a registered user with a verified account, I want to subscribe to other channels, so that I can keep up with the
channels I like.

Subscriptions belong to a channel, not to the account: the channel the user is currently acting as is the one that
subscribes. The user's subscriptions can be managed in
[US-Subscriptions-02](./US-Subscriptions-02-Manage-own-subscriptions.md), and their videos browsed in
[US-Subscriptions-03](./US-Subscriptions-03-Subscription-content-page.md).

**User flows**

Subscribe — main flow:

1. User finds the subscribe button in one of two places: under the player on a video page
   ([US-Videos-01](../videos/US-Videos-01-Watch-videos.md)), or in the channel header on a channel page
   ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).
2. User clicks "Subscribe".
3. The button changes to "Subscribed" straight away.
4. The channel the user is acting as is now subscribed.

Unsubscribe — main flow:

1. User clicks the "Subscribed" button.
2. The button changes back to "Subscribe" straight away, with no confirmation.
3. The subscription is removed.

Branches:

* **The user's own channel** — the subscribe button is not rendered on the user's own channel page, or under their own
  videos.
* **Another channel of the same account** — it is a separate identity, and subscribing to it works like subscribing to
  any other channel.
* **Request fails** — the button returns to its previous state and the default toast behaviour applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The video page has a subscribe button under the player, and the channel page has one in the channel header.
* The button reads "Subscribe" when the current channel is not subscribed and "Subscribed" when it is.
* Clicking "Subscribe" subscribes; clicking "Subscribed" unsubscribes, without a confirmation.
* The button state changes immediately, before the server confirms, and reverts if the request fails.
* The button is not rendered for the user's own channel.
* Subscribing twice in a row still results in a single subscription.
* The subscriber count shown for a channel is the stored one. It is not adjusted on the client after subscribing, so it
  may take a few seconds to change — the button state is what confirms the action.
* A channel with no subscribers shows no subscriber count at all, rather than "0 subscribers".

**Tech notes**

* A subscription links the subscribing channel to the subscribed channel, and the subscriber is the acting channel
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)). A unique constraint on that pair
  makes
  a repeated subscribe request harmless.
* Whether the current channel is subscribed is read from the subscription data directly, never inferred from a counter.
* Subscribing and unsubscribing emit events, consumed by:
    * `subscriber-count-worker`, which updates the subscribed channel's count in the channels database in Kafka batches,
      so the count lags by up to a batch — the same count channel search sorts by
      ([US-Search-02](../search/US-Search-02-Search-channels.md));
    * notifications, for the new subscribers notification
      ([US-Notifications-01](../notifications/US-Notifications-01-Notifications-config.md));
    * the recommender, for which subscriptions are feedback
      ([US-Recommendations-01](../recommendations/US-Recommendations-01-Feed.md)).
* **The unsubscribe event must carry when the subscription was originally created.** US-Notifications-01 lowers the open
  new subscribers notification only if the removed subscription was counted in it, and that creation time is what it
  compares against. Without it, an unsubscribe can lower a count it was never part of.
* Subscriptions to a soft-deleted channel are hidden, not deleted, so restoring the channel brings them back
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)).

**Links**

* [US-Channels-04 — See own and other channels](../channels/US-Channels-04-see-own-and-other-channels.md)
* [US-Notifications-01 — Configure notifications](../notifications/US-Notifications-01-Notifications-config.md)
* [US-Subscriptions-02 — Manage own subscriptions](./US-Subscriptions-02-Manage-own-subscriptions.md)
* [US-Subscriptions-03 — Subscription content page](./US-Subscriptions-03-Subscription-content-page.md)
* [US-Videos-01 — Watch videos](../videos/US-Videos-01-Watch-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
