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

resource "kubernetes_namespace" "eventstore_ns" {
  metadata {
    name = "eventstore"
  }
}

resource "kubectl_manifest" "eventstore_deployment" {
  yaml_body          = file("${path.cwd}/deploy/eventstore-config/eventstore-k8s-deployment.yaml")
  override_namespace = kubernetes_namespace.eventstore_ns.metadata.0.name
}

resource "kubectl_manifest" "eventstore_svc_deployment" {
  yaml_body          = file("${path.cwd}/deploy/eventstore-config/eventstore-k8s-service.yaml")
  override_namespace = kubernetes_namespace.eventstore_ns.metadata.0.name
}

