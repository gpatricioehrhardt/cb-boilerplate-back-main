# My app API

Describe, in high level, your app here.

## Architecture
- TypeScript
- Node.js
- NestJS
- Prisma (Database ORM)
- Docker
- Docker Compose
- NewRelic (Monitoring and Observability)

#### Solution Architecture Version 1.0
<img src="docs/architecture-v1.png" alt="Architecture" width="500"/>

## Setup

### Environment Variables
Rename the `.env.template` file to `.env`, the template file is configured to run locally using docker-compose
```
cp .env.template .env
```
### Install Dependencies
```bash
yarn
```
### Generate Prisma Schema
```
yarn prisma
```

## Run with Docker

[Recommended] Starts all necessary infrastructure to run and debug the app.

```bash
yarn start:docker
```

## Run Locally
[Not Recommended] You must manually initialize the PostgreSQL database

```bash
# dev/debug mode
yarn start:dev

# production mode
yarn start:prod
```

## Run Tests Locally
unit tests
```bash
$ yarn test
```

## Run Lint Locally
```bash
$ yarn lint
```

## Migrations

### Apply Migrations
```bash
# Local
yarn prisma:migrate:deploy

# Docker (Safe - only applies if needed)
yarn prisma:migrate:deploy:docker
```

## Debug
### Remote Debug (Docker)
Create `.vscode/launch.json` file
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Remote Debug App",
      "type": "node",
      "request": "attach",
      "address": "localhost",
      "port": 9229,
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app",
      "restart": true,
      "timeout": 10000,
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      "name": "Debug App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "args": [],
      "runtimeArgs": [
        "-r",
        "ts-node/register",
        "-r",
        "tsconfig-paths/register"
      ],
      "cwd": "${workspaceFolder}",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development"
      },
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
```
- `Remote Debug App` attach in running docker container
- `Debug App` start app on debug mode locally
