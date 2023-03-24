# AKS cluster variables
resource_group_name = "goalie"
cluster_name = "goalie"
cluster_version= "1.24.9"
node_pool_name = "agentpool"
node_count = "1"
node_disk_size = "30"
node_group_min_size = "1"
node_group_max_size = "2"
vm_type = "Standard_B4ms"

common_tags = {
  terraform   = "true"
  environment = "curity-example-deployment"
}
