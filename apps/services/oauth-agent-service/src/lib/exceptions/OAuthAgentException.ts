export abstract class OAuthAgentException extends Error {
  public statusCode = 500;
  public code = 'server_error';
  public logInfo = '';
}
