import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Config } from '../config/config.interface';

/**
 * The health controller. It is used to check the health of the service.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly config: ConfigService<Config>
  ) {}

  /**
   * Check the health of the service.
   * It checks the health of the Curity server if the configuration is set.
   * It checks the health of the user management service if the configuration is set.
   * @returns the health check result.
   */
  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    const userManagementEndpoint = this.config.get('userManagementEndpoint', { infer: true });

    return this.health.check([
      async () =>
        this.microservice.pingCheck('nats', {
          transport: Transport.NATS,
          options: this.config.get('natsOptions', { infer: true }),
        }),
      ...(userManagementEndpoint
        ? [
            () =>
              this.http.pingCheck('userManagement', userManagementEndpoint, {
                validateStatus: (status) => status === HttpStatus.BAD_REQUEST,
              }),
          ]
        : []),
    ]);
  }
}
