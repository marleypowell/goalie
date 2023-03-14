export class User {
  public readonly userId: string;
  public readonly username: string;
  public readonly roles: string[];

  public constructor(payload: Record<string, any>) {
    this.userId = String(payload['sub']);
    this.username = String(payload['username']);
    this.roles = Array.from<string>(payload['roles']);
  }

  public isAdmin(): boolean {
    return this.roles.includes('admin');
  }
}
