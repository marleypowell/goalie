---
sidebar_position: 2
---

# Goals Service
https://github.com/marleypowell/goalie/tree/main/apps/services/goals-service

The Goals Service is a [NestJS](https://nestjs.com/) application that is responsible for managing goals. For storing data, the goals services uses [Eventstore](https://eventstore.com/). Eventstore is an open-source state-transition database that is optimized for storing events. The goals service uses Eventstore to store events that represent changes to goals, this pattern is known as [Event Sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing). The goals service uses [CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) to read and write data. The goals service uses [NATS](https://nats.io/) to communicate with the [API Gateway](#api-gateway).

Event Sourcing was used instead of a traditional relational database because it was a better fit for the domain. This provided built-in support for auditing which allowed the goals service to easily provide an audit trail for goals. Event Sourcing also provided built-in support for querying which allowed the goals service to easily provide an activity history of goals.

The Goals Service is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [Event Store](https://eventstore.com/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)

A detailed architecture diagram for the goals service can be found [here](../../architecture/goals-service-architecture).
