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

resource "kubernetes_namespace" "oauth_agent_ns" {
  metadata {
    name = "oauth-agent"
  }
}

resource "kubectl_manifest" "oauth_agent_service_deployment" {
  yaml_body          = file("${path.cwd}/../oauth-agent-service-config/oauth-agent-service-k8s-deployment.yaml")
  override_namespace = kubernetes_namespace.oauth_agent_ns.metadata.0.name
}

resource "kubectl_manifest" "oauth_agent_service_ingress_rules_deployment" {
  yaml_body          = file("${path.cwd}/../oauth-agent-service-config/oauth-agent-service-ingress-nginx.yaml")
  override_namespace = kubernetes_namespace.oauth_agent_ns.metadata.0.name
}

resource "kubectl_manifest" "oauth_agent_service_svc_deployment" {
  yaml_body          = file("${path.cwd}/../oauth-agent-service-config/oauth-agent-service-k8s-service.yaml")
  override_namespace = kubernetes_namespace.oauth_agent_ns.metadata.0.name
}
