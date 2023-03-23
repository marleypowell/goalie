import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { createMockGoals } from '../testing/create-mock-goals';
import { UserGoalsComponent } from './user-goals.component';

export default {
  component: UserGoalsComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    createGoal: { action: 'createGoal' },
    goalClicked: { action: 'goalClicked' },
  },
} as Meta<Partial<UserGoalsComponent>>;

export const Default = {
  args: {
    goals: createMockGoals(),
  },
};

export const NoOverflow = {
  ...Default,
  args: {
    ...Default.args,
    goals: createMockGoals(3),
  },
};
