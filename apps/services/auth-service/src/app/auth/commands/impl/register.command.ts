export class RegisterCommand {
  public constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
