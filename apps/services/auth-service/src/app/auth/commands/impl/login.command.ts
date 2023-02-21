export class LoginCommand {
  public constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
