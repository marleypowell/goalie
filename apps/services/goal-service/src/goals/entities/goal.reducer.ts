import { Goal, GoalJsonEvent } from '@goalie/shared/goals';

export const goalReducer = (goal: Goal, event: GoalJsonEvent): Goal => {
  switch (event.type) {
    case 'GoalCreatedEvent': {
      return {
        goalId: event.data.goalId,
        userId: event.data.userId,
        name: event.data.name,
        target: event.data.target,
        goalCompleted: false,
        goalDeleted: false,
      };
    }
    case 'GoalCompletedEvent': {
      return {
        ...goal,
        goalCompleted: true,
      };
    }
    case 'GoalDeletedEvent': {
      return {
        ...goal,
        goalDeleted: true,
      };
    }
  }
};
