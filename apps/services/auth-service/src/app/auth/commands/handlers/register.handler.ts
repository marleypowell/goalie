import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma';
import { JwtService, JwtTokens } from '../../services/jwt.service';
import { RegisterCommand } from '../impl/register.command';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  public async execute({
    email,
    password,
  }: RegisterCommand): Promise<JwtTokens> {
    const preexistingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (preexistingUser) {
      throw new Error(`User already exists for email: ${email}`);
    }

    const hashedPassword = await this.jwtService.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return await this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
    });
  }
}
