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

resource "kubernetes_namespace" "api_gateway_ns" {
  metadata {
    name = "api-gateway"
  }
}

resource "kubectl_manifest" "api_gateway_deployment" {
  yaml_body          = file("${path.cwd}/../api-gateway-config/api-gateway-k8s-deployment.yaml")
  override_namespace = kubernetes_namespace.api_gateway_ns.metadata.0.name
}


resource "kubectl_manifest" "api_gateway_ingress_rules_deployment" {
  yaml_body          = file("${path.cwd}/../api-gateway-config/api-gateway-ingress-nginx.yaml")
  override_namespace = kubernetes_namespace.api_gateway_ns.metadata.0.name
}

resource "kubectl_manifest" "api_gateway_svc_deployment" {
  yaml_body          = file("${path.cwd}/../api-gateway-config/api-gateway-k8s-service.yaml")
  override_namespace = kubernetes_namespace.api_gateway_ns.metadata.0.name

}

