## Project setup

```bash
$ yarn install
```

## Environment variables

```dotenv
# App
# local | development | production
NODE_ENV=local
PORT=3003
CORS_DOMAINS=*

# Database
DATABASE_URL=postgres://user:password@localhost:5432/postgres?sslmode=disable

# gRPC
GRPC_USER_SERVICE_URL=localhost:5001
GRPC_CHANNEL_SERVICE_URL=localhost:5002

# JWT
JWT_SECRET=jwt-local-secret
JWT_EXPIRES_IN=1h

# Auth Sessions
REFRESH_TOKEN_EXPIRES_IN=30d
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
