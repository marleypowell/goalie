import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SecurityConfig } from '../../config/config.interface';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class JwtService {
  public constructor(
    private readonly jwt: Jwt,
    private readonly configService: ConfigService
  ) {}

  /**
   * Generates access and refresh tokens for the given payload.
   * @param payload the payload to generate the tokens for.
   * @returns the generated tokens.
   */
  public async generateTokens(payload: JwtPayload): Promise<JwtTokens> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generates an access token for the given payload.
   * @param payload the payload to generate the token for.
   * @returns the generated token.
   */
  private generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  /**
   * Generates a refresh token for the given payload.
   * @param payload the payload to generate the token for.
   * @returns the generated token.
   */
  private generateRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshIn =
      this.configService.get<SecurityConfig['refreshIn']>('security.refreshIn');
    return this.jwt.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: refreshIn,
    });
  }

  /**
   * Verifies the given token. Throws an UnauthorizedException if the token is invalid.
   * @param token the token to verify.
   * @returns the verified payload.
   */
  public async verify(token: string): Promise<JwtPayload> {
    try {
      return await this.jwt.verifyAsync<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('JWT failed verification');
    }
  }

  /**
   * Hashes the given password using bcrypt.
   * @param password the password to hash.
   * @param saltRounds the number of salt rounds to use.
   * @returns the hashed password.
   */
  public async hashPassword(password: string): Promise<string> {
    const bcryptSaltRounds = this.configService.get<
      SecurityConfig['bcryptSaltRounds']
    >('security.bcryptSaltRounds');
    const salt = await bcrypt.genSalt(bcryptSaltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares the given password to the given hashed password.
   * @param password the password to compare.
   * @param hashedPassword the hashed password to compare the password to.
   * @returns true if the password matches the hashed password.
   */
  public validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
