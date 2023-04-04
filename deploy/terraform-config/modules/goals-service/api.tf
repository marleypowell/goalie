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

resource "kubernetes_namespace" "goals_ns" {
  metadata {
    name = "goals"
  }
}

resource "helm_release" "goals_service" {
  name       = "goals-service"
  chart      = "${path.cwd}/deploy/goals-service-config"
  namespace  = kubernetes_namespace.goals_ns.metadata.0.name

  values = [
    file("${path.cwd}/deploy/goals-service-config/values.yaml")
  ]
}