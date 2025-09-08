## Project setup

```bash
$ yarn install
```

## Environment variables

```dotenv
# App
# local | development | production
NODE_ENV=local
PORT=3001
CORS_DOMAINS=*

# Database
DATABASE_URL=postgres://user:password@localhost:5432/postgres?sslmode=disable

# gRPC
GRPC_URL=0.0.0.0:5001

# JWT
JWT_SECRET=jwt-local-secret
JWT_EXPIRES_IN=1h

# NSFW resrictions
# User should be at least this (years) old to access NSFW content 
ALLOW_NSFW_FROM_YEARS=18
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
