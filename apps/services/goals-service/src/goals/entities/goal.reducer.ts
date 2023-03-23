import { Goal, GoalRecordedEvent } from '@goalie/shared/goals';

export const goalReducer = (goal: Goal, event: GoalRecordedEvent): Goal => {
  switch (event.type) {
    case 'GoalCreatedEvent': {
      return {
        goalId: event.data.goalId,
        userId: event.data.userId,
        name: event.data.name,
        target: event.data.target,
        goalCompleted: false,
        goalDeleted: false,
        createdAt: event.created.toISOString(),
      };
    }
    case 'GoalCompletedEvent': {
      return {
        ...goal,
        goalCompleted: true,
        completedAt: event.created.toISOString(),
      };
    }
    case 'GoalDeletedEvent': {
      return {
        ...goal,
        goalDeleted: true,
        deletedAt: event.created.toISOString(),
      };
    }
  }
};
