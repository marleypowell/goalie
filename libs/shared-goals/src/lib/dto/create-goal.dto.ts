import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public target: number;

  public constructor(name: string, target: number) {
    this.name = name;
    this.target = target;
  }
}
