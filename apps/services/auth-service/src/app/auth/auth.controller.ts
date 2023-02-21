import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { LoginCommand } from './commands/impl/login.command';
import { RegisterCommand } from './commands/impl/register.command';
import { ValidateCommand } from './commands/impl/validate.command';
import { JwtTokens } from './services/jwt.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('register')
  public register(
    @Payload() data: { email: string; password: string },
    @Ctx() _ctx: NatsContext
  ): Promise<JwtTokens> {
    this.logger.log(`Received register command: ${JSON.stringify(data)}`);
    return this.commandBus.execute<RegisterCommand, JwtTokens>(
      new RegisterCommand(data.email, data.password)
    );
  }

  @MessagePattern('login')
  public login(
    @Payload() data: { email: string; password: string },
    @Ctx() _ctx: NatsContext
  ): Promise<JwtTokens> {
    this.logger.log(`Received login command: ${JSON.stringify(data)}`);
    return this.commandBus.execute<LoginCommand, JwtTokens>(
      new LoginCommand(data.email, data.password)
    );
  }

  @MessagePattern('validate')
  public validate(
    @Payload() data: { token: string },
    @Ctx() _ctx: NatsContext
  ): Promise<any> {
    this.logger.log(`Received login command: ${JSON.stringify(data)}`);
    return this.commandBus.execute<ValidateCommand, any>(
      new ValidateCommand(data.token)
    );
  }
}
