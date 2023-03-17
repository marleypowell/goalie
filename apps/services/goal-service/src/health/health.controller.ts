import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Config } from '../config/config.interface';

@Controller('health')
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly config: ConfigService<Config>
  ) {}

  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () =>
        this.microservice.pingCheck('nats', {
          transport: Transport.NATS,
          options: this.config.get('natsOptions', { infer: true }),
        }),
      async () =>
        this.http.pingCheck('eventstore', `http://${this.config.get('eventStoreOptions.endpoint', { infer: true })}`),
    ]);
  }
}
