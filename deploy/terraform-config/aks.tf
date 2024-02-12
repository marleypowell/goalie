resource "azurerm_kubernetes_cluster" "aks_cluster" {
  name                      = "goalie"
  resource_group_name       = azurerm_resource_group.goalie.name
  location                  = azurerm_resource_group.goalie.location
  dns_prefix                = "goalie"
  automatic_channel_upgrade = "rapid"

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name                = "agentpool"
    vm_size             = "Standard_B4ms"
    node_count          = 1
    enable_auto_scaling = true
    min_count           = 1
    max_count           = 2
    os_disk_size_gb     = 64
  }
}
