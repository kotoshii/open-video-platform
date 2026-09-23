## channel-api: Export an account's channels over gRPC

Add the gRPC method that takes an account id and returns every channel of the account as plain data: the name, the
description, the avatar's URL, the settings, when it was created, and — when it has one scheduled — the date its
deletion is due to run.

Why: the export starts here, because only `channel-api` knows which channels the account has; every other service is
asked by channel id. A channel with a deletion scheduled is a live channel like any other, so only its date is extra.
