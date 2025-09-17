-- migrate:up
create type comment_rate_type as enum ('like', 'dislike');

create table if not exists comment_rates
(
    id           uuid primary key         not null default gen_random_uuid(),
    comment_id   uuid                     not null,
    channel_id   uuid                     not null,
    type         comment_rate_type        not null,
    created_date timestamp with time zone not null default now(),
    updated_date timestamp with time zone not null default now()
);

-- migrate:down
drop table if exists comment_rates;
drop type if exists comment_rate_type;
