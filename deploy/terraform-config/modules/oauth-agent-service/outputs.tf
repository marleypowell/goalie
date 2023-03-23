output "dependency_provider_api" {
# The value is not important because we're just using this for creating dependencies
  value = kubectl_manifest.oauth_agent_service_ingress_rules_deployment.name
}
