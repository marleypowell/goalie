export interface JwtConfig {
  jwksUri: string;
  audience: string;
  issuer: string;
}

export interface Config {
  jwtConfig: JwtConfig;
}
