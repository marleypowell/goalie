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

resource "kubernetes_namespace" "users_ns" {
  metadata {
    name = "users"
  }
}

resource "helm_release" "users_service" {
  name       = "users-service"
  chart      = "${path.cwd}/deploy/users-service-config"
  namespace  = kubernetes_namespace.users_ns.metadata.0.name

  values = [
    file("${path.cwd}/deploy/users-service-config/values.yaml")
  ]

  set {
    name  = "accountsClientSecret"
    value = var.accounts_client_secret
  }
}
