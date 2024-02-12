resource "azurerm_container_registry" "acr" {
  name                = "goalie"
  resource_group_name = azurerm_resource_group.goalie.name
  location            = azurerm_resource_group.goalie.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_role_assignment" "aks_cluster_to_acr" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.aks_cluster.kubelet_identity[0].object_id
}
