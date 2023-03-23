import { Meta } from '@storybook/angular';
import { createMockGoalActivity } from '../testing/create-mock-goal-activity';
import { GoalActivityComponent } from './goal-activity.component';

export default {
  component: GoalActivityComponent,
  argsTypes: {},
} as Meta<Partial<GoalActivityComponent>>;

export const Default = {
  args: {
    activity: createMockGoalActivity(),
  },
};
