import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Config } from '../config/config.interface';

/**
 * The health controller. It is used to check the health of the service.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly config: ConfigService<Config>
  ) {}

  /**
   * Check the health of the service. It checks the health of the Curity server if the configuration is set.
   * @returns the health check result.
   */
  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    const curityHealthEndpoint = this.config.get('curityHealthEndpoint', { infer: true });
    return this.health.check([
      ...(curityHealthEndpoint ? [() => this.http.pingCheck('curity', curityHealthEndpoint)] : []),
    ]);
  }
}
