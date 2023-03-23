import { GoalActivity } from '@goalie/shared/api-client-api-gateway';

export function createMockGoalActivity(): GoalActivity[] {
  return [
    {
      created: '2023-03-22T14:59:47.129Z',
      type: 'GoalDeletedEvent',
      data: {
        userId: '263d3476-c7d1-11ed-b854-6045bdd0b782',
        user: {
          name: {
            formatted: 'Admin',
            givenName: 'Admin',
          },
        },
      },
    },
    {
      created: '2023-03-22T14:39:47.129Z',
      type: 'GoalCompletedEvent',
      data: {
        userId: '263d3476-c7d1-11ed-b854-6045bdd0b782',
        user: {
          name: {
            formatted: 'Marley Powell',
            givenName: 'Marley',
            familyName: 'Powell',
          },
        },
      },
    },
    {
      created: '2023-03-21T10:16:40.802Z',
      type: 'GoalCreatedEvent',
      data: {
        goalId: 'e50ef063-c199-46e4-9eb7-e7fc50a8742b',
        userId: '263d3476-c7d1-11ed-b854-6045bdd0b782',
        name: 'Goal 1',
        target: 1000,
        user: {
          name: {
            formatted: 'Marley Powell',
            givenName: 'Marley',
            familyName: 'Powell',
          },
        },
      },
    },
  ] as unknown as GoalActivity[];
}
