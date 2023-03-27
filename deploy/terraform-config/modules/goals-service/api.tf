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

resource "kubectl_manifest" "goals_service_deployment" {
  yaml_body          = file("${path.cwd}/deploy/goals-service-config/goals-service-k8s-deployment.yaml")
  override_namespace = kubernetes_namespace.goals_ns.metadata.0.name
}

resource "kubectl_manifest" "goals_service_svc_deployment" {
  yaml_body          = file("${path.cwd}/deploy/goals-service-config/goals-service-k8s-service.yaml")
  override_namespace = kubernetes_namespace.goals_ns.metadata.0.name
}

