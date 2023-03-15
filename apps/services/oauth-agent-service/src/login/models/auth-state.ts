import base64url from 'base64url';

export class AuthState {
  public readonly path: string;

  public constructor(path: string) {
    this.path = path;
  }

  public toString(): string {
    return base64url.encode(JSON.stringify(this));
  }

  public static fromString(str: string): AuthState {
    return JSON.parse(base64url.decode(str));
  }
}
