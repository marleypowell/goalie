# Goalie

#### Goalie is a goal tracking tool that allows users to create and track their own goals.

---

Further documentation can be found here: https://docs.mp.exclaimertest.net

## Project Setup Instructions  - [GitHub Repo](https://github.com/marleypowell/goalie)

**Requirements**
- [Node v18](https://nodejs.org/)
- [Docker](https://www.docker.com/)

```bash
# Project setup steps
git clone https://github.com/marleypowell/goalie.git
cd goalie
cp .env.example .env # Update the .env file with your own values

yarn install
docker-compose up -d
```

```bash
# Start the Angular site at localhost:4200
yarn nx serve frontend

# Start the NestJS API Gateway at localhost:3333
yarn nx serve api-gateway

# Start the NestJS OAuth Agent Service at localhost:3334
yarn nx serve oauth-agent-service

# Start the NestJS Goals Service at localhost:3335
yarn nx serve goals-service

# Start the NestJS Users Service at localhost:3336
yarn nx serve users-service
```

---
