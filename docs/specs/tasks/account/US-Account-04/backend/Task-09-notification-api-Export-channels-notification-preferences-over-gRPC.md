## notification-api: Export channels' notification preferences over gRPC

Add the gRPC method that takes a list of channel ids and returns their notification preferences — the defaults for a
channel that never saved any.

Why: a channel without a stored row still has preferences — the defaults — so the export says so rather than leaving
the channel out.
