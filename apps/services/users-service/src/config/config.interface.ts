import { TracingOptions } from '@goalie/shared/goals';

export interface AuthOptions {
  clientId: string;
  clientSecret: string;
}

export interface Config {
  port: number;
  tracingOptions: TracingOptions;
  accountsClientOptions: AuthOptions;
  userManagementEndpoint: string;
}
