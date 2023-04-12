---
sidebar_position: 3
---

# OAuth Agent Service
https://github.com/marleypowell/goalie/tree/main/apps/services/oauth-agent-service

The OAuth Agent Service is a [NestJS](https://nestjs.com/) application that is responsible for authenticating users using OAuth. The OAuth Agent Service uses [Curity Identity Server](../../project-structure/services/curity-identity-server) to authenticate users. The OAuth Agent Service uses [NATS](https://nats.io/) to communicate with the [API Gateway](../../project-structure/services/api-gateway).

The [Token-Mediating Backend](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#name-token-mediating-backend) OAuth 2.0 pattern was used to provide a single point of authentication for the application. This is considered a best practice for browser-based applications as documented in [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps).

The OAuth Agent Service provides endpoints to authenticate users using OAuth, to exchange an authorization code for an access token, to exchange a refresh token for an access token. The OAuth Agent Service also provides endpoints to get the user's profile information and to get the user's email address.

The OAuth Agent Service is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)
