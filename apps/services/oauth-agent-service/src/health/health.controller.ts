import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Config } from '../config/config.interface';

@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly config: ConfigService<Config>
  ) {}

  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    const curityHealthEndpoint = this.config.get('curityHealthEndpoint', { infer: true });
    return this.health.check([
      ...(curityHealthEndpoint ? [() => this.http.pingCheck('curity', curityHealthEndpoint)] : []),
    ]);
  }
}
