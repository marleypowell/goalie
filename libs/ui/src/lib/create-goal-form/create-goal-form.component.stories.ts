import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateGoalFormComponent } from './create-goal-form.component';

export default {
  component: CreateGoalFormComponent,
  decorators: [
    moduleMetadata({
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: DynamicDialogRef,
          useValue: {
            close: action('close'),
          },
        },
      ],
    }),
  ],
};

export const Default = {
  args: {
    users: [
      {
        name: {
          formatted: 'Marley Powell',
          givenName: 'Marley',
          familyName: 'Powell',
        },
      },
    ],
    defaultOwner: {
      name: {
        formatted: 'Marley Powell',
        givenName: 'Marley',
        familyName: 'Powell',
      },
    },
  },
};
