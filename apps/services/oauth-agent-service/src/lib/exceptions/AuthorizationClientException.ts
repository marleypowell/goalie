import { Grant } from '../grant';
import { OAuthAgentException } from './OAuthAgentException';

export default class AuthorizationClientException extends OAuthAgentException {
  // By default assume a configuration error
  public statusCode = 400;
  public code = 'authorization_error';

  public constructor(grant: Grant, status: number, responseText: string) {
    super('A request sent to the Authorization Server was rejected');

    // User info requests can be caused by expiry, in which case inform the SPA so that it can avoid an error display
    if (grant === Grant.UserInfo && status == 401) {
      this.code = 'token_expired';
      this.statusCode = 401;
    }

    // Refresh tokens will expire eventually, in which case inform the SPA so that it can avoid an error display
    if (grant === Grant.RefreshToken && responseText.indexOf('invalid_grant') !== -1) {
      this.code = 'session_expired';
      this.statusCode = 401;
    }

    this.logInfo = `${Grant[grant]} request failed with status: ${status} and response: ${responseText}`;
  }
}
