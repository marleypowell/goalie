import { OAuthAgentException } from './OAuthAgentException';

export default class MissingTempLoginDataException extends OAuthAgentException {
  public statusCode = 400;
  public code = 'invalid_request';

  public constructor() {
    super('Missing temp data when completing a login');
  }
}
