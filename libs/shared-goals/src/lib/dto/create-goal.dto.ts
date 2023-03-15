import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO for creating a goal.
 */
export class CreateGoalDto {
  /**
   * The user ID.
   */
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  public userId: string;

  /**
   * The name of the goal.
   */
  @IsString()
  @IsNotEmpty()
  public name: string;

  /**
   * The target number of times to complete the goal.
   */
  @IsNumber()
  public target: number;

  public constructor(userId: string, name: string, target: number) {
    this.userId = userId;
    this.name = name;
    this.target = target;
  }
}
