import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateGoalFormComponent } from './create-goal-form.component';

export default {
  component: CreateGoalFormComponent,
  decorators: [
    moduleMetadata({
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

export const Default = {};
