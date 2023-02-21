import type { Config } from './config.interface';

const config: Config = {
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltRounds: 10,
  },
};

export default (): Config => config;
