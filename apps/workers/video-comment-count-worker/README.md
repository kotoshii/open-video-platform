## Project setup

```bash
$ yarn install
```

## Environment variables

```dotenv
# App
# local | development | production
NODE_ENV=local

# Database (same as for video-api)
DATABASE_URL=postgres://user:password@localhost:5432/postgres?sslmode=disable

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_SESSION_TIMEOUT=30000
KAFKA_HEARTBEAT_INTERVAL=3000
KAFKA_GROUP_ID=video-comment-count-worker
# default: 5 MB (5242880 bytes)
KAFKA_MIN_BYTES=5242880
# default: 10 MB (10485760 bytes)
KAFKA_MAX_BYTES=10485760
KAFKA_MAX_WAIT_TIME_IN_MS=10000

# Kafka deduplication
KAFKA_DEDUP_REDIS_URL=redis://default:localpassword@127.0.0.1:6379
# default: 1 hour (in seconds)
KAFKA_DEDUP_TTL=3600
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
