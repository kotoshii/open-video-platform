-- migrate:up
create table if not exists channels (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    name varchar(255) not null,
    description varchar(1024) default null,
    subscriber_count bigint not null default 0,
    created_date timestamp with time zone not null default now(),
    updated_date timestamp with time zone not null default now()
);

-- migrate:down
drop table channels;
