import { CheckInGoalHandler } from './check-in-goal.handler';
import { CompleteGoalHandler } from './complete-goal.handler';
import { CreateGoalHandler } from './create-goal.handler';
import { DeleteGoalHandler } from './delete-goal.handler';

export const CommandHandlers = [CreateGoalHandler, CompleteGoalHandler, DeleteGoalHandler, CheckInGoalHandler];
