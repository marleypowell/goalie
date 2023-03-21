export class User {
  public readonly userId: string;
  public readonly username: string;
  public readonly roles: string[];

  public constructor(payload: Record<string, any>) {
    this.userId = String(payload['account_id']);
    this.username = String(payload['preferred_username']);
    this.roles = Array.from<string>(payload['roles']);
  }

  public isAdmin(): boolean {
    return this.roles.includes('admin');
  }
}
