---
sidebar_position: 1
---

# Microservice Architecture

Microservice architecture is a software development approach that structures an application as a collection of loosely coupled, independently deployable services. Each service is designed to perform a specific function, and can communicate with other services using standard protocols such as RESTful APIs.

By breaking the application down into smaller, more modular services, developers can more easily manage the complexity of the application and make changes to individual components without affecting the rest of the system.

Furthermore, microservice architecture also enabled a more agile development approach. By dividing the application into smaller services, developers can work on specific features or functions in isolation, which reduces the risk of conflicts or delays caused by changes made to other parts of the system.

Overall, the decision to use microservice architecture for the application was based on a combination of factors, including the need for flexibility, and agility, as well as the complex nature of the application.

![Microservice Architecture](img/microservice-architecture.svg)

Further documentation of the components in this diagram can be found here:
- [Goals Application](../project-structure/apps/frontend)
- [API Gateway API](../project-structure/services/api-gateway)
- [Message Bus](../architecture/technologies/nats)
- [OAuth Agent Service API](../project-structure/services/oauth-agent-service)
- [User Service API](../project-structure/services/user-service)
- [Goals Service API](../project-structure/services/goals-service)
- [Curity Service API](../project-structure/services/curity-identity-server)
