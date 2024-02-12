resource "azurerm_resource_group" "goalie" {
  name     = "goalie"
  location = "uksouth"

  lifecycle {
    prevent_destroy = true
  }
}
