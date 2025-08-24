-- migrate:up
create table if not exists refresh_tokens
(
    id                 uuid primary key                                                default gen_random_uuid(),
    auth_session_id    uuid references auth_sessions (id) on delete no action not null,
    refresh_token_hash text unique                                            not null,
    active             boolean                                                not null default true,
    expires_at         timestamp with time zone                               not null, -- this refers to REFRESH TOKEN expiration time
    used_date          timestamp with time zone                                        default null,
    created_date       timestamp with time zone                               not null default now(),
    updated_date       timestamp with time zone                               not null default now()
);

-- migrate:down
drop table refresh_tokens;
