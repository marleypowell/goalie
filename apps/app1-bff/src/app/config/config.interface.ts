import { TracingOptions } from '@goalie/shared/goals';
import { NatsOptions } from '@nestjs/microservices';

export interface JwtConfig {
  jwksUri: string;
  audience: string;
  issuer: string;
}

export interface Config {
  port: number;
  jwtConfig: JwtConfig;
  natsOptions: NatsOptions['options'];
  corsEnabled: boolean;
  trustedWebOrigins: string[];
  tracingOptions: TracingOptions;
}
