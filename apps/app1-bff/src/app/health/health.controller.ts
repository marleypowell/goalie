import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { AllowAnonymous } from '../auth/allow-anonymous.decorator';
import { Config } from '../config/config.interface';

@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly config: ConfigService<Config>
  ) {}

  @Get()
  @AllowAnonymous()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () =>
        this.microservice.pingCheck('nats', {
          transport: Transport.NATS,
          options: this.config.get('natsOptions', { infer: true }),
        }),
    ]);
  }
}
