import { TracingOptions } from '@goalie/shared/goals';
import { NatsOptions } from '@nestjs/microservices';

export interface AuthOptions {
  clientId: string;
  clientSecret: string;
}

export interface Config {
  port: number;
  tracingOptions: TracingOptions;
  accountsClientOptions: AuthOptions;
  userManagementEndpoint: string;
  natsOptions: NatsOptions['options'];
}
