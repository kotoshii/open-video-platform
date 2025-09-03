## Project setup

```bash
$ yarn install
```

## Environment variables

```dotenv
# App
# local | development | production
NODE_ENV=local

# Database (same as for channel-api)
DATABASE_URL=postgres://user:password@localhost:5432/postgres?sslmode=disable

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_GROUP_ID=subscriber-count-worker
# default: 5 MB (5242880 bytes)
KAFKA_MIN_BYTES=5242880

# Kafka deduplication
KAFKA_DEDUP_REDIS_URL=redis://default:localpassword@127.0.0.1:6379
KAFKA_DEDUP_TTL=7d
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
