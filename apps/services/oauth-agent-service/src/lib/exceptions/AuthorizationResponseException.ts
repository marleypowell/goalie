import { OAuthAgentException } from './OAuthAgentException';

// Thrown when the OpenId Connect response returns a URL like this:
// https://www.example.com?state=state=nu2febouwefbjfewbj&error=invalid_scope&error_description=
export default class AuthorizationResponseException extends OAuthAgentException {
  public statusCode = 400;
  public code: string;

  public constructor(error: string, description: string) {
    super(description);

    // Return the error code to the browser, eg invalid_scope
    this.code = error;

    // Treat the prompt=none response as expiry related
    if (this.code === 'login_required') {
      this.statusCode = 401;
    }
  }
}
