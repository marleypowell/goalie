import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { SecurityConfig } from '../config/config.interface';
import { PrismaModule } from '../prisma';
import { AuthController } from './auth.controller';
import { CommandHandlers } from './commands/handlers';
import { JwtService } from './services/jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [JwtService, JwtStrategy, ...CommandHandlers],
})
export class AuthModule {}
