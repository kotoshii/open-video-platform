-- migrate:up
create table if not exists subscriptions
(
    id                      uuid primary key                  default gen_random_uuid(),
    subscriber_channel_id   uuid                     not null,
    subscribed_channel_id   uuid                     not null,
    subscribed_channel_name varchar(255)             not null,
    created_date            timestamp with time zone not null default now(),
    updated_date            timestamp with time zone not null default now(),
    check (subscriber_channel_id <> subscribed_channel_id), -- prevent self-subscribe
    unique (subscriber_channel_id, subscribed_channel_id)
);

-- migrate:down
drop table subscriptions;
