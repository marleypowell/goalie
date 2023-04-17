import { TracingOptions } from '@goalie/common';
import { NatsOptions } from '@nestjs/microservices';

/**
 * The configuration interface.
 */
export interface AuthOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * The configuration interface.
 */
export interface Config {
  port: number;
  tracingOptions: TracingOptions;
  accountsClientOptions: AuthOptions;
  userManagementEndpoint: string;
  natsOptions: NatsOptions['options'];
}
