---
sidebar_position: 1
---

# API Gateway
https://github.com/marleypowell/goalie/tree/main/apps/api-gateway

The API Gateway is a [NestJS](https://nestjs.com/) application that is responsible for routing requests to the appropriate service. The API Gateway also handles authentication and authorization.

The API Gateway communicates with the following services using [NATS](https://nats.io/):
- [Goals Service](#goals-service)
- [Users Service](#users-service)

NATS is used to communicate between services because it is a lightweight, high-performance, and reliable messaging system. NATS is also used because it is easy to use and it is easy to integrate with other technologies.

The API Gateway is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [CASL](https://casl.js.org/)
- [Passport](http://www.passportjs.org/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)
