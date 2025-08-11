-- migrate:up
create table if not exists users (
   id uuid primary key default gen_random_uuid(),
   email varchar(320) not null unique,
   date_of_birth date not null,
   password_hash text not null,
   created_date timestamp with time zone not null default now(),
   updated_date timestamp with time zone not null default now()
);

-- migrate:down
drop table users;
