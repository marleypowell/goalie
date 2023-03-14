import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGoalDto {
  public userId: string | undefined;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public target: number;

  public constructor(name: string, target: number, userId?: string) {
    this.name = name;
    this.target = target;

    if (userId) {
      this.userId = userId;
    }
  }

  public withUserId(userId: string): CreateGoalDto {
    return new CreateGoalDto(this.name, this.target, userId);
  }
}
