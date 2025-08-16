-- migrate:up
create table if not exists user_passwords (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    password_hash text not null,
    created_date timestamp with time zone not null default now(),
    updated_date timestamp with time zone not null default now()
);

-- migrate:down
drop table user_passwords;
