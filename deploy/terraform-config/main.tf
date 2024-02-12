terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.33.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.14.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.7.0"
    }

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14.0"
    }
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_client_config" "current" {}
data "azurerm_subscription" "current" {}

# module "aks_cluster" {
#   source                       = "./modules/aks-cluster/"
# }

# module "curity_idsvr" {
#   source                 = "./modules/curity-idsvr/"
#   idsvr_namespace        = "curity"
#   host                   = module.aks_cluster.host
#   client_certificate     = base64decode(module.aks_cluster.client_certificate)
#   client_key             = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate = base64decode(module.aks_cluster.cluster_ca_certificate)
# }

# module "api_gateway" {
#   source                     = "./modules/api-gateway/"
#   host                       = module.aks_cluster.host
#   client_certificate         = base64decode(module.aks_cluster.client_certificate)
#   client_key                 = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate     = base64decode(module.aks_cluster.cluster_ca_certificate)
#   oauth_proxy_encryption_key = var.cookie_encryption_key
#   oauth_proxy_client_secret  = var.oauth_proxy_client_secret
# }

# module "goals_service" {
#   source                 = "./modules/goals-service/"
#   host                   = module.aks_cluster.host
#   client_certificate     = base64decode(module.aks_cluster.client_certificate)
#   client_key             = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate = base64decode(module.aks_cluster.cluster_ca_certificate)
# }

# module "users_service" {
#   source                 = "./modules/users-service/"
#   host                   = module.aks_cluster.host
#   client_certificate     = base64decode(module.aks_cluster.client_certificate)
#   client_key             = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate = base64decode(module.aks_cluster.cluster_ca_certificate)
#   accounts_client_secret = var.accounts_client_secret
# }

# module "oauth_agent_service" {
#   source                    = "./modules/oauth-agent-service/"
#   host                      = module.aks_cluster.host
#   client_certificate        = base64decode(module.aks_cluster.client_certificate)
#   client_key                = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate    = base64decode(module.aks_cluster.cluster_ca_certificate)
#   oauth_agent_client_secret = var.oauth_agent_client_secret
#   cookie_encryption_key     = var.cookie_encryption_key
# }

# module "ingress_nginx" {
#   source                       = "./modules/ingress-nginx/"
#   ingress_controller_namespace = "ingress-nginx"
#   host                         = module.aks_cluster.host
#   client_certificate           = base64decode(module.aks_cluster.client_certificate)
#   client_key                   = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate       = base64decode(module.aks_cluster.cluster_ca_certificate)
#   ingress_nginx_depends_on_1   = module.curity_idsvr.dependency_provider_curity
# }

# module "nats" {
#   source                 = "./modules/nats/"
#   host                   = module.aks_cluster.host
#   client_certificate     = base64decode(module.aks_cluster.client_certificate)
#   client_key             = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate = base64decode(module.aks_cluster.cluster_ca_certificate)
# }

# module "eventstore" {
#   source                 = "./modules/eventstore/"
#   host                   = module.aks_cluster.host
#   client_certificate     = base64decode(module.aks_cluster.client_certificate)
#   client_key             = base64decode(module.aks_cluster.client_key)
#   cluster_ca_certificate = base64decode(module.aks_cluster.cluster_ca_certificate)
# }
