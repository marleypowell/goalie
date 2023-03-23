import { createMockGoals } from '../testing/create-mock-goals';
import { GoalsTableComponent } from './goals-table.component';

export default {
  component: GoalsTableComponent,
};

export const Default = {
  args: {
    goals: createMockGoals(),
  },
};
