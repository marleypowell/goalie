---
sidebar_position: 2
---

# Project Structure

The project was created using the [Nx](https://nx.dev/) monorepo tool. The project is organized into apps, services, and libraries. Nx is a tool that helps you develop full-stack applications using a monorepo. Nx helps you develop applications using a component-driven approach. Nx also helps you develop applications using a microservices architecture.

The frontend apps are built using [Angular](https://angular.io/). The backend microservices are built using [NestJS](https://nestjs.com/). The project is organized as follows:

![Project Structure](img/project-structure.png)

## Apps

### [Frontend](https://github.com/marleypowell/goalie/tree/main/apps/frontend)

The frontend is an Angular single page application (SPA) that is built using the Angular CLI. The frontend is responsible for the UI and user interaction. The frontend communicates with the [API Gateway](#api-gateway) to retrieve data and perform actions. The frontend communicates with the [OAuth Agent service](#oauth-agent-service) to perform authentication and authorization.

The application follows a component-driven approach where components are grouped by feature. Each component has its own folder that contains the following files:

- `component.ts` - The component class
- `component.html` - The component template
- `component.scss` - The component styles
- `component.spec.ts` - The component unit tests

The components and other code are grouped into the following folders:

- `libs/ui/src/lib` - Contains the components that can used by multiple features
- `apps/frontend/src/app/features` - Contains the components that are used by a specific feature
- `apps/frontend/src/app/shared` - Contains the components that are shared across features
- `apps/frontend/src/app/services` - Contains the services that are used by the application

The application uses the [UI](#ui) library for common UI components. The application uses the [API Gateway API Client](#api-gateway-api-client) library to communicate with the [API Gateway](#api-gateway). The application uses the [OAuth Agent API Client](#oauth-agent-api-client) library to communicate with the [OAuth Agent service](#oauth-agent-service).

The frontend is built using the following technologies:
- [Angular](https://angular.io/)
- [RxJS](https://rxjs.dev/)
- [PrimeNG](https://primeng.org/)
- [CASL](https://casl.js.org/)

### [Website](https://github.com/marleypowell/goalie/tree/main/apps/website)

The website is a static site that is built using [Docusaurus 2](https://v2.docusaurus.io/). The website is used to document the project and provide information about the project.

## Services

### [API Gateway](https://github.com/marleypowell/goalie/tree/main/apps/api-gateway)

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

### [Goals Service](https://github.com/marleypowell/goalie/tree/main/apps/services/goals-service)

The Goals Service is a [NestJS](https://nestjs.com/) application that is responsible for managing goals. For storing data, the goals services uses [Eventstore](https://eventstore.com/). Eventstore is an open-source state-transition database that is optimized for storing events. The goals service uses Eventstore to store events that represent changes to goals, this pattern is known as [Event Sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing). The goals service uses [CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) to read and write data. The goals service uses [NATS](https://nats.io/) to communicate with the [API Gateway](#api-gateway).

Event Sourcing was used instead of a traditional relational database because it was a better fit for the domain. This provided built-in support for auditing which allowed the goals service to easily provide an audit trail for goals. Event Sourcing also provided built-in support for querying which allowed the goals service to easily provide an activity history of goals.

The Goals Service is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [Event Store](https://eventstore.com/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)

### [OAuth Agent Service](https://github.com/marleypowell/goalie/tree/main/apps/services/oauth-agent-service)

The OAuth Agent Service is a [NestJS](https://nestjs.com/) application that is responsible for authenticating users using OAuth. The OAuth Agent Service uses [Curity Identity Server](#curity-identity-server) to authenticate users. The OAuth Agent Service uses [NATS](https://nats.io/) to communicate with the [API Gateway](#api-gateway).

The [Token-Mediating Backend](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#name-token-mediating-backend) OAuth 2.0 pattern was used to provide a single point of authentication for the application. This is considered a best practice for browser-based applications as documented in [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps).

The OAuth Agent Service provides endpoints to authenticate users using OAuth, to exchange an authorization code for an access token, to exchange a refresh token for an access token. The OAuth Agent Service also provides endpoints to get the user's profile information and to get the user's email address.

The OAuth Agent Service is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)


### [Users Service](https://github.com/marleypowell/goalie/tree/main/apps/service/users-service)

The Users Service is a [NestJS](https://nestjs.com/) application that is responsible for forwarding requests to the [Curity Identity Server](#curity-identity-server). The Users Service uses [NATS](https://nats.io/) to communicate with the [API Gateway](#api-gateway).

The [Curity Identity Server](#curity-identity-server) has users GraphQL endpoint that is used to manage users. The Users Service provides endpoints to get a single user, to get a list of users, to create a user, to update a user, and to delete a user.

The Users Service is built using the following technologies:
- [NestJS](https://nestjs.com/)
- [NATS](https://nats.io/)
- [Open Telemetry](https://opentelemetry.io/)
- [GraphQL](https://graphql.org/)

### [Curity Identity Server](https://curity.io/) (3rd Party)

The Curity Identity Server is a self-hosted OAuth 2.0 and OpenID Connect 1.0 provider that is used to authenticate users.

The Curity Identity Server has 3 services:
- [Authentication Service](https://curity.io/product/authentication-service)
- [Token Service](https://curity.io/product/token-service/)
- [User Management Service](https://curity.io/product/user-management-service/)

The Authentication Service is used to authenticate users using OAuth 2.0 and OpenID Connect 1.0. The Token Service is used to issue access tokens and refresh tokens. The User Management Service is used to manage users.

## Libraries

### [Common](https://github.com/marleypowell/goalie/tree/main/libs/common)

The Common library contains common code that is used by other libraries and services.

### [API Gateway API Client](https://github.com/marleypowell/goalie/tree/main/libs/shared-api-client-api-gateway)

The API Gateway API Client library is an [Angular](https://angular.io/) library that is used to communicate with the [API Gateway](#api-gateway). It is generated using [OpenAPI Generator](https://openapi-generator.tech/).

### [OAuth Agent API Client](https://github.com/marleypowell/goalie/tree/main/libs/shared-api-client-oauth-agent)

The OAuth Agent API Client library is an [Angular](https://angular.io/) library that is used to communicate with the [OAuth Agent Service](#oauth-agent-service). It is generated using [OpenAPI Generator](https://openapi-generator.tech/).

### [Shared Goals](https://github.com/marleypowell/goalie/tree/main/libs/shared-goals)

The Shared Goals library is an [Angular](https://angular.io/) library that contains common code that is used by the [Goals Service](#goals-service) and the [UI](#ui).

### [UI](https://github.com/marleypowell/goalie/tree/main/libs/ui)

The UI library is an [Angular](https://angular.io/) library with reusable UI components consumed by the [Frontend](#frontend).
