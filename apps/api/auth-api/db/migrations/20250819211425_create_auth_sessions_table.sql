-- migrate:up
create table if not exists auth_sessions
(
    id           uuid primary key                  default gen_random_uuid(),
    user_id      uuid                     not null,
    channel_id   uuid                              default null,
    country_code varchar(2)                        default null,
    country_name text                              default null,
    city_name    text                              default null,
    ip_address   inet                              default null,
    user_agent   text                              default null,
    expires_at   timestamp with time zone not null, -- this refers to ACCESS TOKEN expiration time
    created_date timestamp with time zone not null default now(),
    updated_date timestamp with time zone not null default now()
);

-- migrate:down
drop table auth_sessions;
