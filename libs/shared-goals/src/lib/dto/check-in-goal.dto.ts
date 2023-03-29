import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO for checking in a goal.
 */
export class CheckInGoalDto {
  /**
   * The goal ID.
   */
  @IsString()
  @IsNotEmpty()
  public goalId: string;

  /**
   * The user ID.
   */
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  public userId: string;

  /**
   * The progress of the goal.
   */
  @IsNumber()
  public progress: number;

  /**
   * The comment for the check-in.
   */
  @IsString()
  public comment: string;

  public constructor(goalId: string, progress: number, comment: string) {
    this.goalId = goalId;
    this.progress = progress;
    this.comment = comment;
  }
}
