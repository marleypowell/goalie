import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma';
import { JwtService, JwtTokens } from '../../services/jwt.service';
import { LoginCommand } from '../impl/login.command';
import { RegisterCommand } from '../impl/register.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  public async execute({
    email,
    password,
  }: RegisterCommand): Promise<JwtTokens> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error(`No user found for email: ${email}`);
    }

    const passwordValid = await this.jwtService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    return await this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }
}
