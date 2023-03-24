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

resource "kubernetes_namespace" "nats_ns" {
  metadata {
    name = "nats"
  }
}

resource "kubectl_manifest" "nats_deployment" {
  yaml_body          = file("${path.cwd}/../nats-config/nats-k8s-deployment.yaml")
  override_namespace = kubernetes_namespace.nats_ns.metadata.0.name
}

resource "kubectl_manifest" "nats_svc_deployment" {
  yaml_body          = file("${path.cwd}/../nats-config/nats-k8s-service.yaml")
  override_namespace = kubernetes_namespace.nats_ns.metadata.0.name
}
