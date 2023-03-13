import { GoalJsonEvent } from '../events';

export interface GoalActivity {
  created: Date;
  type: GoalJsonEvent['type'];
  data: GoalJsonEvent['data'];
}
