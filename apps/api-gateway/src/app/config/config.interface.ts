import { TracingOptions } from '@goalie/common';
import { NatsOptions } from '@nestjs/microservices';

/**
 * The JWT config.
 */
export interface JwtConfig {
  jwksUri: string;
  audience: string;
  issuer: string;
}

/**
 * The configuration.
 */
export interface Config {
  port: number;
  jwtConfig: JwtConfig;
  natsOptions: NatsOptions['options'];
  corsEnabled: boolean;
  trustedWebOrigins: string[];
  tracingOptions: TracingOptions;
}
