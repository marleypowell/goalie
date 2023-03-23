import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { createMockGoalActivity } from '../testing/create-mock-goal-activity';
import { createMockGoal } from '../testing/create-mock-goals';
import { GoalDetailsComponent } from './goal-details.component';

export default {
  component: GoalDetailsComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
  argsTypes: {},
} as Meta<Partial<GoalDetailsComponent>>;

export const Default = {
  args: {
    goal: createMockGoal(),
    goalActivity: createMockGoalActivity(),
  },
};

export const Completed = {
  ...Default,
  args: {
    ...Default.args,
    goal: createMockGoal(3),
  },
};
