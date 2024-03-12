import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloClientService } from '../common/apollo-client.service';
import { UserManagementService } from '../common/user-management.service';
import { QueryHandlers } from './queries';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['**/*.graphql'],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HttpModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [UsersResolver, ApolloClientService, UserManagementService, ...QueryHandlers],
})
export class UsersModule {}
