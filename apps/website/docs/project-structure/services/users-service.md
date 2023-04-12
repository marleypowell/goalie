---
sidebar_position: 4
---

# Users Service
https://github.com/marleypowell/goalie/tree/main/apps/service/users-service

The Users Service is a [NestJS](https://nestjs.com/) application that is responsible for forwarding requests to the [Curity Identity Server](../../project-structure/services/curity-identity-server). The Users Service uses [NATS](https://nats.io/) to communicate with the [API Gateway](../../project-structure/services/api-gateway).

The [Curity Identity Server](../../project-structure/services/curity-identity-server) has users GraphQL endpoint that is used to manage users. The Users Service provides endpoints to get a single user, to get a list of users, to create a user, to update a user, and to delete a user.

The Users Service is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)
- [GraphQL](https://graphql.org/)
