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

resource "kubernetes_namespace" "oauth_agent_ns" {
  metadata {
    name = "oauth-agent"
  }
}

resource "helm_release" "example" {
  name       = "oauth-agent-service"
  chart      = "${path.cwd}/../oauth-agent-service-config"
  namespace  = kubernetes_namespace.oauth_agent_ns.metadata.0.name

  set {
    name  = "clientSecret"
    value = var.oauth_agent_client_secret
  }

  set {
    name  = "cookieEncryptionKey"
    value = var.cookie_encryption_key
  }
}
