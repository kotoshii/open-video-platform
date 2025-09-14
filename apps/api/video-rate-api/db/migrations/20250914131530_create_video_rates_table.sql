-- migrate:up
create type video_rate_type as enum ('like', 'dislike');

create table if not exists video_rates
(
    id           uuid primary key         not null default gen_random_uuid(),
    video_id     uuid                     not null,
    channel_id   uuid                     not null,
    type         video_rate_type          not null,
    created_date timestamp with time zone not null default now(),
    updated_date timestamp with time zone not null default now()
);

-- migrate:down
drop table if exists video_rates;
drop type if exists video_rate_type;
