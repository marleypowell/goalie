import { CookieSerializeOptions } from 'cookie';
import type { Config } from './config.interface';

const useSsl = !!process.env.SERVER_CERT_P12_PATH;

export default (): Config => ({
  // Host settings
  port: parseInt(process.env.PORT, 10) || 3334,
  endpointsPrefix: '/api',
  serverCertPath: process.env.SERVER_CERT_P12_PATH || '',
  serverCertPassword: process.env.SERVER_CERT_P12_PASSWORD || '',

  // Client settings
  clientID: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  redirectUri: process.env.REDIRECT_URI || 'http://localhost:3200',
  postLogoutRedirectURI: process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3200',
  scope: process.env.SCOPE || 'openid profile goals accounts',

  // Cookie related settings
  cookieNamePrefix: process.env.COOKIE_NAME_PREFIX || 'goalie',
  encKey: process.env.COOKIE_ENCRYPTION_KEY || '',
  trustedWebOrigins: [process.env.TRUSTED_WEB_ORIGIN || 'http://localhost:3200'],
  corsEnabled: process.env.CORS_ENABLED ? process.env.CORS_ENABLED === 'true' : true,
  cookieOptions: {
    httpOnly: true,
    sameSite: true,
    secure: useSsl,
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    path: '/',
  } as CookieSerializeOptions,

  // Authorization Server settings
  issuer: process.env.ISSUER || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-anonymous',
  authorizeEndpoint: process.env.AUTHORIZE_ENDPOINT || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-authorize',
  logoutEndpoint: process.env.LOGOUT_ENDPOINT || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-session/logout',
  tokenEndpoint: process.env.TOKEN_ENDPOINT || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-token',
  userInfoEndpoint: process.env.USERINFO_ENDPOINT || 'https://login.mp.exclaimertest.net/oauth/v2/oauth-userinfo',
});
