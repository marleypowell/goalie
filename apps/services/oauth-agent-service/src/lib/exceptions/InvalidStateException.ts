import { OAuthAgentException } from './OAuthAgentException';

export default class InvalidStateException extends OAuthAgentException {
  public statusCode = 400;
  public code = 'invalid_request';

  public constructor() {
    super('State parameter mismatch when completing a login');
  }
}
