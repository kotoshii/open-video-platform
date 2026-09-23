## subscription-api: Export channels' subscriptions over gRPC

Add the gRPC method that takes a list of channel ids and returns the channels they subscribe to, with when each
subscription was made.

Why: only the channel's own subscriptions go in. Who subscribes to it is a list of other channels' choices, not its
own data.
