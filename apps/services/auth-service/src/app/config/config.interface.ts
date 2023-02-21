export interface Config {
  security: SecurityConfig;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltRounds: number;
}
