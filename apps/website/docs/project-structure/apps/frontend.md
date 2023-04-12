---
sidebar_position: 1
---

# Frontend
https://github.com/marleypowell/goalie/tree/main/apps/frontend

The frontend is an Angular single page application (SPA) that is built using the Angular CLI. The frontend is responsible for the UI and user interaction. The frontend communicates with the [API Gateway](../../project-structure/services/api-gateway) to retrieve data and perform actions. The frontend communicates with the [OAuth Agent service](../../project-structure/services/oauth-agent-service) to perform authentication and authorization.

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

The application uses the [UI](../../project-structure/libraries/ui) library for common UI components. The application uses the [API Gateway API Client](../../project-structure/libraries/api-gateway-api-client) library to communicate with the [API Gateway](../../project-structure/services/api-gateway). The application uses the [OAuth Agent API Client](../../project-structure/libraries/oauth-agent-api-client) library to communicate with the [OAuth Agent service](../../project-structure/services/oauth-agent-service).

The frontend is built using the following technologies:
- [Angular](https://angular.io/)
- [RxJS](https://rxjs.dev/)
- [PrimeNG](https://primeng.org/)
- [CASL](https://casl.js.org/)
