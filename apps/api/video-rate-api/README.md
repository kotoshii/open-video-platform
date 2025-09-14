## Project setup

```bash
$ yarn install
```

## Environment variables

```dotenv
# App
# local | development | production
NODE_ENV=local
PORT=3006
CORS_DOMAINS=*

# Database
DATABASE_URL=postgres://user:password@localhost:5432/postgres?sslmode=disable

# gRPC
GRPC_VIDEO_SERVICE_URL=localhost:5005

# JWT
JWT_SECRET=jwt-local-secret
JWT_EXPIRES_IN=1h

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=video-rate-api
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
