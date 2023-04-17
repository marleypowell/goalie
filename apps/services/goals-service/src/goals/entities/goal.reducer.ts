import { Goal, GoalRecordedEvent } from '@goalie/shared/goals';

/**
 * The goal reducer. This reducer is responsible for reducing the goal.
 * @param goal the goal
 * @param event the event
 * @returns the updated goal
 */
export const goalReducer = (goal: Goal, event: GoalRecordedEvent): Goal => {
  switch (event.type) {
    case 'GoalCreatedEvent': {
      return {
        goalId: event.data.goalId,
        userId: event.data.userId,
        name: event.data.name,
        target: event.data.target,
        progress: 0,
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
    case 'GoalCheckedInEvent': {
      return {
        ...goal,
        progress: event.data.progress,
        updatedAt: event.created.toISOString(),
      };
    }
  }
};
