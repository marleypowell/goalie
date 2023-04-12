workspace {
  !identifiers hierarchical

  model {
    user = person "User" "A user that wants to track goals"

    goalsSystem = softwareSystem "Goals System" {
      messageBus = container "Message Bus" {
        tags "Message Bus"
        description "The message bus is responsible for dispatching messages to the appropriate message handler."
        technology "NATS"
      }

      goalsApplication = container "Goals Application" {
        tags "Web Application" "Angular"
        technology "Angular"
      }

      goalsService = group "Goals Service" {
        goalsServiceDatabase = container "Goals Service EventStore" {
          tags "Goals Service" "Database" "EventStore"
          technology "EventStoreDB"
        }

        goalsServiceApi = container "Goals Service API" {
          tags "Goals Service" "Service API"
          technology "NestJS"

          queryBus = component "Query Bus" {
            tags "Query Bus"
            description "The query bus is responsible for dispatching queries to the appropriate query handler."
          }

          commandBus = component "Command Bus" {
            tags "Command Bus"
            description "The command bus is responsible for dispatching commands to the appropriate command handler."
          }

          eventBus = component "Event Bus" {
            tags "Event Bus"
            description "The event bus is responsible for dispatching events to the appropriate event handler."
          }

          goalsController = component "Goals Controller" {
            tags "Controller" "Goals Controller"
            description "The goals controller is responsible for handling all requests to create, update, and delete goals."
          }

          goalsRepository = component "Goals Repository"

          queries = group "Queries" {
            getGoalActivityQuery = component "Get Goal Activity Query" {
              tags "Query"
            }
            getGoalQuery = component "Get Goal Query" {
              tags "Query"
            }
            getGoalsQuery = component "Get Goals Query" {
              tags "Query"
            }
          }

          commands = group "Commands" {
            checkInGoalCommand = component "Check In Goal Command" {
              tags "Command"
            }
            completeGoalCommand = component "Complete Goal Command" {
              tags "Command"
            }
            createGoalCommand = component "Create Goal Command" {
              tags "Command"
            }
            deleteGoalCommand = component "Delete Goal Command" {
              tags "Command"
            }
          }

          events = group "Events" {
            goalCheckedInEvent = component "Goal Checked In Event" {
              tags "Event"
            }
            goalCompletedEvent = component "Goal Completed Event" {
              tags "Event"
            }
            goalCreatedEvent = component "Goal Created Event" {
              tags "Event"
            }
            goalDeletedEvent = component "Goal Deleted Event" {
              tags "Event"
            }
          }

          goalsController -> queryBus "Reads using"
          goalsController -> commandBus "Writes using"

          queryBus -> getGoalActivityQuery "Dispatches to"
          queryBus -> getGoalQuery "Dispatches to"
          queryBus -> getGoalsQuery "Dispatches to"

          commandBus -> checkInGoalCommand "Dispatches to"
          commandBus -> completeGoalCommand "Dispatches to"
          commandBus -> createGoalCommand "Dispatches to"
          commandBus -> deleteGoalCommand "Dispatches to"

          eventBus -> goalCheckedInEvent "Publishes to"
          eventBus -> goalCompletedEvent "Publishes to"
          eventBus -> goalCreatedEvent "Publishes to"
          eventBus -> goalDeletedEvent "Publishes to"

          getGoalActivityQuery -> goalsRepository "Reads from"
          getGoalQuery -> goalsRepository "Reads from"
          getGoalsQuery -> goalsRepository "Reads from"

          checkInGoalCommand -> goalsRepository "Writes to"
          completeGoalCommand -> goalsRepository "Writes to"
          createGoalCommand -> goalsRepository "Writes to"
          deleteGoalCommand -> goalsRepository "Writes to"

          goalsRepository -> goalsServiceDatabase "Reads from and writes to"
          goalsRepository -> eventBus "Publishes to"
        }

        goalsServiceApi -> goalsServiceDatabase "Reads from and writes to"
      }

      apiGateway = group "API Gateway" {
        apiGatewayApi = container "API Gateway API" {
          tags "API Gateway" "Service API"
          technology "NestJS"
        }
      }

      usersService = group "Users Service" {
        usersServiceApi = container "Users Service API" {
          tags "Users Service" "Service API"
          technology "NestJS"

          usersController = component "Users Controller" {
            tags "Controller" "Users Controller"
            description "The users controller is responsible for reading users."
          }
        }
      }

      curityService = group "Curity Service" {
        curityApplication = container "Curity Application" {
          tags "Web Application"
          technology "Angular"
        }

        curityServiceApi = container "Curity Service API" {
          tags "Curity Service" "Service API"
          technology "Java"
        }

        curityServiceDatabase = container "Curity Service Database" {
          tags "Curity Service" "Database"
          technology "PostgreSQL"
          curityServiceApi -> this "Reads from and writes to"
        }
      }

      oauthAgentService = group "OAuth Agent Service" {
        oauthAgentServiceApi = container "OAuth Agent Service API" {
          tags "OAuth Agent Service" "Service API"
          technology "NestJS"

          claimsController = component "Claims Controller" {
            tags "Controller" "Claims Controller"
            description "The claims controller is responsible for handling all requests to get claims from the OAuth Agent Service."
          }

          healthController = component "Health Controller" {
            tags "Controller" "Health Controller"
            description "The health controller is responsible for handling all requests to check the health of the service."
          }

          loginController = component "Login Controller" {
            tags "Controller" "Login Controller"
            description "The login controller is responsible for handling all requests to login to the OAuth Agent Service."
          }

          loginService = component "Login Service" {
            tags "Nest Service" "Login Service"
          }

          logoutController = component "Logout Controller" {
            tags "Controller" "Logout Controller"
            description "The logout controller is responsible for handling all requests to logout of the OAuth Agent Service."
          }

          refreshTokenController = component "Refresh Token Controller" {
            tags "Controller" "Refresh Token Controller"
            description "The refresh token controller is responsible for handling all requests to refresh a token from the OAuth Agent Service."
          }

          userInfoController = component "User Info Controller" {
            tags "Controller" "User Info Controller"
            description "The user info controller is responsible for handling all requests to get user info from the OAuth Agent Service."
          }

          loginController -> loginService "Uses"
        }
      }

      # relationships to/from containers
      user -> goalsApplication "Creates and tracks goals using"
      user -> curityApplication "Logs in or registers using"

      goalsApplication -> apiGatewayApi "Makes API calls to" "JSON/HTTPS"
      goalsApplication -> oauthAgentServiceApi "Authenticates with"
      goalsApplication -> curityApplication "Redirects to"

      apiGatewayApi -> messageBus "Publishes messages to" "NATS"

      oauthAgentServiceApi -> curityServiceApi "Authenticates with" "JSON/HTTPS"

      usersServiceApi -> curityServiceApi "Fetches user data from" "JSON/HTTPS"

      curityApplication -> goalsApplication "Redirects to"
      curityApplication -> curityServiceApi "Validates credentials and registers with"

      # relationships to/from components
      goalsApplication -> oauthAgentServiceApi.loginController "Logs in with" "JSON/HTTPS"
      goalsApplication -> oauthAgentServiceApi.logoutController "Logs out with" "JSON/HTTPS"
      goalsApplication -> oauthAgentServiceApi.refreshTokenController "Refreshes tokens with" "JSON/HTTPS"
      goalsApplication -> oauthAgentServiceApi.userInfoController "Fetches user info with" "JSON/HTTPS"
      goalsApplication -> oauthAgentServiceApi.claimsController "Fetches claims with" "JSON/HTTPS"

      messageBus -> goalsServiceApi.goalsController "Sends messages to" "NATS"
      messageBus -> usersServiceApi.usersController "Sends messages to" "NATS"

      oauthAgentServiceApi.loginService -> curityServiceApi "Creates login url and gets auth token using" "JSON/HTTPS"
    }

    # relationships between people and software systems
    user -> goalsSystem "Creates and tracks goals using"

    live = deploymentEnvironment "Live" {
      deploymentNode "Azure" {
        deploymentNode "UK South" {
          dnsZone = infrastructureNode "DNS Zone" {
            tags "Microsoft Azure - DNS Zones"
          }

          containerRegistry = infrastructureNode "Container Registry" {
            tags "Microsoft Azure - Container Registries"
          }

          deploymentNode "PostgreSQL" {
            tags "Microsoft Azure - Azure Database PostgreSQL Server"

            containerInstance goalsSystem.curityServiceDatabase
          }

          aks = deploymentNode "Azure Kubernetes Service" {
            tags "Microsoft Azure - Kubernetes Services"

            ingress = infrastructureNode "Ingress Controller" {
              technology "NGINX"
            }


            apiGateway = containerInstance goalsSystem.apiGatewayApi
            containerInstance goalsSystem.goalsServiceApi
            containerInstance goalsSystem.usersServiceApi
            oauthAgentService = containerInstance goalsSystem.oauthAgentServiceApi
            containerInstance goalsSystem.curityApplication
            containerInstance goalsSystem.curityServiceApi

            deploymentNode "EventStore" {
              tags "EventStore"

              containerInstance goalsSystem.goalsServiceDatabase
            }

            deploymentNode "NATS" {
              tags "NATS"
              technology "NATS"

              containerInstance goalsSystem.messageBus
            }
          }

          staticGoalsApplication = deploymentNode "Static Web App" {
            tags "Microsoft Azure - Static Apps"

            w = containerInstance goalsSystem.goalsApplication
          }

          aks -> containerRegistry "Loads containers from"
          aks.ingress -> aks.apiGateway "Routes to"
          aks.ingress -> aks.oauthAgentService "Routes to"

          dnsZone -> aks.ingress "Resolves to"
          dnsZone -> staticGoalsApplication "Resolves to"
        }
      }
    }
  }

  views {
    systemcontext goalsSystem "SystemContext" {
        include *
        autoLayout
        description "The system context diagram for the Goals System."
        properties {
            structurizr.groups false
        }
    }

    container goalsSystem "Goals_System_Container" {
      include *
      autolayout lr

      exclude "goalsSystem.goalsApplication -> goalsSystem.curityApplication"
      exclude "goalsSystem.curityApplication -> goalsSystem.goalsApplication"
    }

    component goalsSystem.goalsServiceApi "Goals_Service_API" {
      include *
      autolayout
      description "The component diagram for the Goals Service API."
    }

    component goalsSystem.oauthAgentServiceApi "OAuth_Agent_Service_API" {
      include *
      autolayout
      description "The component diagram for the OAuth Agent Service API."
    }

    dynamic goalsSystem.oauthAgentServiceApi "SignIn" {
      user -> goalsSystem.goalsApplication "Uses"
      goalsSystem.goalsApplication -> goalsSystem.oauthAgentServiceApi.loginController "Submits a login start request to"
      goalsSystem.oauthAgentServiceApi.loginController -> goalsSystem.goalsApplication "Returns a login url to"
      goalsSystem.goalsApplication -> goalsSystem.curityApplication "Redirects to"
      user -> goalsSystem.curityApplication "Enters credentials and signs in to"
      goalsSystem.curityApplication -> goalsSystem.curityServiceApi "Validates credentials with"
      goalsSystem.curityServiceApi -> goalsSystem.curityApplication "Returns auth code and state to"
      goalsSystem.curityApplication -> goalsSystem.goalsApplication "Redirects to"
      goalsSystem.goalsApplication -> goalsSystem.oauthAgentServiceApi.loginController "Submits a login end request to"
      goalsSystem.oauthAgentServiceApi.loginController -> goalsSystem.oauthAgentServiceApi.loginService "Sends auth code to"
      goalsSystem.oauthAgentServiceApi.loginService -> goalsSystem.curityServiceApi "Sends auth code to"
      goalsSystem.curityServiceApi -> goalsSystem.oauthAgentServiceApi.loginService "Returns auth token to"
      goalsSystem.oauthAgentServiceApi.loginService -> goalsSystem.oauthAgentServiceApi.loginController "Returns auth cookies to"
      goalsSystem.oauthAgentServiceApi.loginController -> goalsSystem.goalsApplication "Returns auth cookies to"
      description "The user signs in to the Goals System."
    }

    deployment goalsSystem live "Deployment_All" {
      include *
      autolayout lr

      exclude "goalsSystem.goalsApplication -> goalsSystem.curityApplication"
      exclude "goalsSystem.curityApplication -> goalsSystem.goalsApplication"
    }

    styles {
      element "Person" {
        shape Person
        color #ffffff
        background #08427b
      }
      element "Service API" {
        shape hexagon
      }
      element "Database" {
        shape cylinder
      }
      element "Goals Service" {
        background #91F0AE
      }
      element "API Gateway" {
        background #EDF08C
      }
      element "Users Service" {
        background #8CD0F0
      }
      element "OAuth Agent Service" {
        background #F08CA4
      }
      element "Curity Service" {
        background #FFAC33
      }

      element "Message Bus" {
        shape pipe
        background #f7dd19
      }

      element "Controller" {
        color #ffffff
        background #08427b
      }

      element "Command Bus" {
        shape pipe
        background #22e369
      }
      element "Command" {
        shape roundedBox
        background #0cb349
      }

      element "Query Bus" {
        shape pipe
        background #fcba03
      }
      element "Query" {
        shape roundedBox
        background #fa9302
      }

      element "Event Bus" {
        shape pipe
        background #f7f7f7
      }
      element "Event" {
        shape roundedBox
        background #f7f7f7
      }

      element "Web Application" {
        shape webbrowser
      }

      element "Angular" {
        color #ffffff
        background #dd1b16
      }

      element "Nest Service" {
        background #faf039
      }
    }

    theme https://static.structurizr.com/themes/microsoft-azure-2023.01.24/theme.json
  }
}
