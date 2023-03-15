import { CookieSerializeOptions } from 'cookie';

export interface Config {
  // Host settings
  port: number;
  endpointsPrefix: string;
  serverCertPath: string;
  serverCertPassword: string;

  // Client Configuration
  clientID: string;
  clientSecret: string;
  redirectUri: string;
  postLogoutRedirectURI: string;
  scope: string;

  // Authorization Server settings
  issuer: string;
  authorizeEndpoint: string;
  logoutEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;

  // Secure cookie and CORS configuration
  cookieNamePrefix: string;
  encKey: string;
  trustedWebOrigins: string[];
  corsEnabled: boolean;
  cookieOptions: CookieSerializeOptions;
}
