import { Meta } from '@storybook/angular';
import { createMockGoals } from '../testing/create-mock-goals';
import { GoalsListComponent } from './goals-list.component';

export default {
  component: GoalsListComponent,
  argsTypes: {
    goalClicked: { action: 'goalClicked' },
  },
} as Meta<Partial<GoalsListComponent>>;

export const Default = {
  args: {
    goals: createMockGoals(),
  },
};
