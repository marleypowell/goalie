provider "helm" {
  kubernetes {
    host                   = azurerm_kubernetes_cluster.aks_cluster.kube_config[0].host
    client_certificate     = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].client_certificate)
    client_key             = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].client_key)
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].cluster_ca_certificate)
  }
}

provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.aks_cluster.kube_config[0].host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].cluster_ca_certificate)
}

provider "kubectl" {
  host                   = azurerm_kubernetes_cluster.aks_cluster.kube_config[0].host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config[0].cluster_ca_certificate)
  load_config_file = false
}

# API Gateway Service
resource "helm_release" "api_gateway_service" {
  name       = "api-gateway"
  chart      = "${path.cwd}/deploy/api-gateway-config"
  namespace  = "api-gateway"
  create_namespace = true

  values = [
    file("${path.cwd}/deploy/api-gateway-config/values.yaml")
  ]

  set {
    name  = "oauthProxy.encryptionKey"
    value = var.cookie_encryption_key
  }

  set {
    name  = "oauthProxy.clientSecret"
    value = var.oauth_proxy_client_secret
  }
}

# Goals Service
resource "helm_release" "goals_service" {
  name       = "goals"
  chart      = "${path.cwd}/deploy/goals-service-config"
  namespace  = "goals"
  create_namespace = true

  values = [
    file("${path.cwd}/deploy/goals-service-config/values.yaml")
  ]
}

# Users Service
resource "helm_release" "users_service" {
  name       = "users"
  chart      = "${path.cwd}/deploy/users-service-config"
  namespace  = "users"
  create_namespace = true

  values = [
    file("${path.cwd}/deploy/users-service-config/values.yaml")
  ]

  set {
    name  = "accountsClientSecret"
    value = var.accounts_client_secret
  }
}

# OAuth Agent Service
resource "helm_release" "oauth_agent_service" {
  name       = "oauth-agent"
  chart      = "${path.cwd}/deploy/oauth-agent-service-config"
  namespace  = "oauth-agent"
  create_namespace = true

  values = [
    file("${path.cwd}/deploy/oauth-agent-service-config/values.yaml")
  ]

  set {
    name  = "clientSecret"
    value = var.oauth_agent_client_secret
  }

  set {
    name  = "cookieEncryptionKey"
    value = var.cookie_encryption_key
  }
}

# NATS
resource "kubernetes_namespace" "nats_ns" {
  metadata {
    name = "nats"
  }
}

resource "kubectl_manifest" "nats_deployment" {
  yaml_body          = file("${path.cwd}/deploy/nats-config/nats-k8s-deployment.yaml")
  override_namespace = kubernetes_namespace.nats_ns.metadata.0.name
}

resource "kubectl_manifest" "nats_svc_deployment" {
  yaml_body          = file("${path.cwd}/deploy/nats-config/nats-k8s-service.yaml")
  override_namespace = kubernetes_namespace.nats_ns.metadata.0.name
}

# Eventstore
resource "kubernetes_namespace" "eventstore_ns" {
  metadata {
    name = "eventstore"
  }
}

resource "kubectl_manifest" "eventstore_deployment" {
  yaml_body          = file("${path.cwd}/deploy/eventstore-config/eventstore-k8s-stateful-set.yaml")
  override_namespace = kubernetes_namespace.eventstore_ns.metadata.0.name
}

resource "kubectl_manifest" "eventstore_svc_deployment" {
  yaml_body          = file("${path.cwd}/deploy/eventstore-config/eventstore-k8s-service.yaml")
  override_namespace = kubernetes_namespace.eventstore_ns.metadata.0.name
}

# Curity Identity Server
resource "kubernetes_namespace" "curity_ns" {
  metadata {
    name = "curity"
  }
}

resource "kubernetes_secret_v1" "idsvr_config" {
  metadata {
    name      = "idsvr-config"
    namespace = kubernetes_namespace.curity_ns.metadata.0.name
  }
  data = {
    "idsvr-cluster-config.xml" = file("${path.cwd}/deploy/idsvr-config/idsvr-cluster-config.xml")
    "license.json"             = file("${path.cwd}/deploy/idsvr-config/license.json")
  }
}

resource "helm_release" "curity_idsvr" {
  name = "curity"
  repository = "https://curityio.github.io/idsvr-helm/"
  chart      = "idsvr"
  namespace = kubernetes_namespace.curity_ns.metadata.0.name

  values = [
    file("${path.cwd}/deploy/idsvr-config/helm-values.yaml")
  ]

  depends_on = [
    kubernetes_secret_v1.idsvr_config
  ]
}

# Nginx Ingress
resource "helm_release" "ingress_nginx" {
  name = "ingress-nginx"

  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"
  create_namespace = true

  values = [
    file("${path.cwd}/deploy/ingress-nginx-config/helm-values.yaml")
  ]

  depends_on = [
    helm_release.curity_idsvr,
  ]
}

# Cert Manager
resource "helm_release" "cert_manager" {
  name = "cert-manager"

  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  namespace  = helm_release.ingress_nginx.namespace

  values = [
    file("${path.cwd}/deploy/cert-manager-config/helm-values.yaml")
  ]

}

resource "kubectl_manifest" "cert_manager_issuer" {
  yaml_body          = file("${path.cwd}/deploy/cert-manager-config/cert-issuer.yaml")
  override_namespace = helm_release.cert_manager.namespace

  depends_on = [
    helm_release.cert_manager
  ]
}
