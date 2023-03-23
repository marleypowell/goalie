export class Goal {
  public goalId: string;
  public userId: string;
  public name: string;
  public target: number;
  public createdAt: string;

  public goalCompleted: boolean;
  public completedAt?: string;

  public goalDeleted: boolean;
  public deletedAt?: string;

  public static get modelName(): string {
    return 'Goal';
  }
}
