import { NatsOptions, Transport } from '@nestjs/microservices';

export interface JwtConfig {
  jwksUri: string;
  audience: string;
  issuer: string;
}

export type GoalsServiceOptions = NatsOptions & { transport: Transport.NATS };

export interface Config {
  port: number;
  jwtConfig: JwtConfig;
  goalsServiceOptions: GoalsServiceOptions;
}
