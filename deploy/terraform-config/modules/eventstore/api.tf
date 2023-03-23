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

provider "kubernetes" {
  host                   = var.host
  client_certificate     = var.client_certificate
  client_key             = var.client_key
  cluster_ca_certificate = var.cluster_ca_certificate
}

resource "kubernetes_namespace" "eventstore_namespace" {
  metadata {
    name = var.eventstore_namespace
  }
}

resource "kubectl_manifest" "eventstore_deployment" {
  yaml_body          = file("${path.cwd}/../eventstore-config/eventstore-k8s-deployment.yaml")
  override_namespace = var.eventstore_namespace
}

resource "kubectl_manifest" "eventstore_svc_deployment" {
  yaml_body          = file("${path.cwd}/../eventstore-config/eventstore-k8s-service.yaml")
  override_namespace = var.eventstore_namespace

}

