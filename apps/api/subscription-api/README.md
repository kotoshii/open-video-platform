## Project setup

```bash
$ yarn install
```

## Environment variables

```dotenv
# App
# local | development | production
NODE_ENV=local
PORT=3004
CORS_DOMAINS=*

# Database
DATABASE_URL=postgres://user:password@localhost:5432/postgres?sslmode=disable

# gRPC
GRPC_URL=0.0.0.0:5004

# JWT
JWT_SECRET=jwt-local-secret
JWT_EXPIRES_IN=1h
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
