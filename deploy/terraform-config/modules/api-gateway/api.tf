terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
    }
  }
}

provider "kubectl" {
  host                   = var.host
  client_certificate     = var.client_certificate
  client_key             = var.client_key
  cluster_ca_certificate = var.cluster_ca_certificate
  load_config_file = false
}

provider "helm" {
  kubernetes {
    host                   = var.host
    client_certificate     = var.client_certificate
    client_key             = var.client_key
    cluster_ca_certificate = var.cluster_ca_certificate
  }
}

provider "kubernetes" {
  host                   = var.host
  client_certificate     = var.client_certificate
  client_key             = var.client_key
  cluster_ca_certificate = var.cluster_ca_certificate
}

resource "kubernetes_namespace" "api_gateway_ns" {
  metadata {
    name = "api-gateway"
  }
}

resource "helm_release" "example" {
  name       = "api-gateway"
  chart      = "${path.cwd}/deploy/api-gateway-config"
  namespace  = kubernetes_namespace.api_gateway_ns.metadata.0.name

  values = [
    file("${path.cwd}/deploy/api-gateway-config/values.yaml")
  ]

  set {
    name  = "oauthProxy.encryptionKey"
    value = var.oauth_proxy_encryption_key
  }

  set {
    name  = "oauthProxy.clientSecret"
    value = var.oauth_proxy_client_secret
  }
}
