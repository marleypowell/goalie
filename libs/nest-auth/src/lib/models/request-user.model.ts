export class RequestUser<Role = string> {
  public userId: string;
  public roles: Role[];
}
