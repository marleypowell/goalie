# Nginx Ingress Controller

https://docs.nginx.com/nginx-ingress-controller/

The Nginx Ingress Controller is a Kubernetes Ingress controller that uses ConfigMap to store the nginx configuration. The ingress controller runs as a pod in a Kubernetes cluster. The ingress controller watches the Kubernetes api server for the addition of Ingress resources. The ingress controller configures the nginx based on the Ingress resources.

In the application the Nginx Ingress Controller is used to route traffic to the [OAuth Agent Service](../../project-structure/services/oauth-agent-service) and the [API Gateway](../../project-structure/services/api-gateway).

The deployment uses a [Phantom Token plugin](https://curity.io/resources/learn/nginx-phantom-token-module/) which is used to exchange an opaque token for a JWT token. The JWT token is then used to authenticate the user.
