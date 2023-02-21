import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma';
import { JwtService } from '../../services/jwt.service';
import { ValidateCommand } from '../impl/validate.command';

@CommandHandler(ValidateCommand)
export class ValidateHandler implements ICommandHandler<ValidateCommand> {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  public async execute({ token }: ValidateCommand): Promise<any> {
    const decodedPayload = await this.jwtService.verify(token);

    if (!decodedPayload) {
      throw new Error(`Invalid token`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decodedPayload.sub },
    });

    if (!user) {
      throw new Error(`User not found`);
    }

    return user;
  }
}
