import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Config } from '../config/config.interface';
import { User } from './user.model';

/**
 * The JWT strategy for authenticating users
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  public constructor(readonly config: ConfigService<Config>) {
    const jwtConfig = config.getOrThrow('jwtConfig', { infer: true });

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwtConfig.jwksUri,
        handleSigningKeyError: (err, cb) => {
          this.logger.error(`Error retrieving signing key: ${err.message}`);
          return cb(err);
        },
      }),
      ignoreExpiration: false,
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    };

    super(options);
  }

  /**
   * Validate the JWT payload and return the user
   * @param payload The JWT payload
   * @returns The user
   */
  public validate(payload: Record<string, any>): User {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    return new User(payload);
  }
}
