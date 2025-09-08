-- migrate:up
create type video_visibility as enum ('public', 'accessible_by_link', 'private');

create type video_selected_thumbnail as enum ('first', 'second', 'third', 'custom');

create table if not exists videos
(
    id                 uuid primary key         not null default gen_random_uuid(),
    channel_id         uuid                     not null,
    channel_name       varchar(255)             not null,
    title              varchar(255)             not null,
    description        varchar(4096)                     default null,
    tags               varchar(255)[]           not null default '{}',
    allow_comments     boolean                  not null default true,
    allow_rates        boolean                  not null default true,
    selected_thumbnail video_selected_thumbnail not null default 'first',
    visibility         video_visibility         not null default 'public',
    is_published       boolean                  not null default false,
    is_nsfw            boolean                  not null default true,
    view_count         bigint                   not null default 0,
    likes              bigint                   not null default 0,
    dislikes           bigint                   not null default 0,
    created_date       timestamp with time zone not null default now(),
    updated_date       timestamp with time zone not null default now()
);

-- migrate:down
drop table if exists videos;
drop type if exists video_visibility;
drop type if exists video_selected_thumbnail;
