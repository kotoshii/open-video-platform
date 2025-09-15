-- migrate:up

create table if not exists comments
(
    id           uuid primary key                                not null default gen_random_uuid(),
    video_id     uuid                                            not null,
    channel_id   uuid                                            not null,
    channel_name varchar(255)                                    not null,
    content      varchar(2048)                                   not null,
    parent_id    uuid references comments (id) on delete cascade not null,
    created_date timestamp with time zone                        not null default now(),
    updated_date timestamp with time zone                        not null default now(),
    check (id <> parent_id) -- prevent self-replies
);

-- migrate:down
drop table if exists comments;
