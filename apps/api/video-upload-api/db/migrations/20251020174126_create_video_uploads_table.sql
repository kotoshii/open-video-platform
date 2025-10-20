-- migrate:up
create type video_upload_status as enum ('uploading', 'uploading_failed', 'uploading_completed', 'processing', 'processing_failed', 'processing_completed');

create table if not exists video_uploads
(
    id                uuid primary key         not null default gen_random_uuid(),
    channel_id        uuid                     not null,
    video_id          uuid                     not null,
    status            video_upload_status      not null default 'uploading',
    original_filename varchar(255)             not null,
    original_size     bigint                   not null, -- size in bytes
    created_date      timestamp with time zone not null default now(),
    updated_date      timestamp with time zone not null default now()
);

-- migrate:down
drop table if exists video_uploads;
drop type if exists video_upload_status;
