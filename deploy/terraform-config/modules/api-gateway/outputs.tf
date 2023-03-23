output "dependency_provider_api" {
# The value is not important because we're just using this for creating dependencies
  value = kubectl_manifest.api_gateway_ingress_rules_deployment.name
}
