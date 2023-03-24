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
  chart      = "${path.cwd}/../api-gateway-config"
  namespace  = kubernetes_namespace.api_gateway_ns.metadata.0.name

  set {
    name  = "oauthProxy.encryptionKey"
    value = var.oauth_proxy_encryption_key
  }

  set {
    name  = "oauthProxy.clientSecret"
    value = var.oauth_proxy_client_secret
  }
}
