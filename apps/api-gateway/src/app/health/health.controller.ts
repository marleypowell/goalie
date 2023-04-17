import { AllowAnonymous } from '@goalie/nest-auth';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Config } from '../config/config.interface';

/**
 * The health controller. Handles all requests for health checks.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly config: ConfigService<Config>
  ) {}

  /**
   * Check the health of the service.
   * @returns the health check result.
   */
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
