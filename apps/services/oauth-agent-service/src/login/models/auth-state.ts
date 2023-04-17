import base64url from 'base64url';

/**
 * Represents the state of an authentication request.
 */
export class AuthState {
  public readonly path: string;

  public constructor(path: string) {
    this.path = path;
  }

  /**
   * Returns the string representation of the state.
   * @returns the string representation of the state
   */
  public toString(): string {
    return base64url.encode(JSON.stringify(this));
  }

  /**
   * Creates an instance of AuthState from the given string.
   * @param str the string representation of the state
   * @returns the state
   */
  public static fromString(str: string): AuthState {
    return JSON.parse(base64url.decode(str));
  }
}
