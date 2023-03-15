import { GoalJsonEvent } from '../events';

export class GoalActivity {
  public created: Date;
  public type: GoalJsonEvent['type'];
  public data: GoalJsonEvent['data'];
}
