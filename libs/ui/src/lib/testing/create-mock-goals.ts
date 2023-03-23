import { Goal } from '@goalie/shared/api-client-api-gateway';

export function createMockGoal(i: number = 0): Goal {
  return {
    goalId: `goal-${i + 1}`,
    name: `Goal ${i + 1} Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
    userId: `marley`,
    user: {
      name: {
        formatted: 'Marley Powell',
        givenName: 'Marley',
        familyName: 'Powell',
      },
    },
    target: (i % 2 === 0 ? 100 : 200) * (i + 1),
    createdAt: new Date().toISOString(),
    goalCompleted: (i + 1) % 4 === 0,
    goalDeleted: false,
  } as any;
}

export function createMockGoals(count = 10): Goal[] {
  return Array.from({ length: count }, (_, i) => createMockGoal(i));
}
