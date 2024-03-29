import { OAuthAgentException } from './OAuthAgentException';

export default class CookieDecryptionException extends OAuthAgentException {
  public statusCode = 401;
  public code = 'unauthorized_request';
  public cause?: Error;

  public constructor(cause?: Error) {
    super('Access denied due to invalid request details');
    this.cause = cause;
  }
}
