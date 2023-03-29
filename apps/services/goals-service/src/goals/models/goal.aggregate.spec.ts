import { CheckInGoalCommand, CreateGoalCommand } from '@goalie/shared/goals';
import { GoalAggregate } from './goal.aggregate';

describe(GoalAggregate.name, () => {
  let goal: GoalAggregate;

  beforeEach(() => {
    goal = new GoalAggregate();
  });

  describe('createGoal', () => {
    it('should create a goal', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);

      expect(goal.getId()).toBe(createGoalCommand.goalId);
      expect(goal.getUserId()).toBe(createGoalCommand.userId);
      expect(goal.getName()).toBe(createGoalCommand.name);
      expect(goal.getTarget()).toBe(createGoalCommand.target);
    });
  });

  describe('completeGoal', () => {
    it('should complete a goal', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.completeGoal();

      expect(goal.getCompleted()).toBe(true);
    });

    it('should not complete a goal if it is already completed', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.completeGoal();

      expect(() => goal.completeGoal()).toThrowError('Goal is already completed');
    });

    it('should not complete a goal if it is deleted', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.deleteGoal();

      expect(() => goal.completeGoal()).toThrowError('Goal is deleted');
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.deleteGoal();

      expect(goal.getDeleted()).toBe(true);
    });

    it('should not delete a goal if it is already deleted', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.deleteGoal();

      expect(() => goal.deleteGoal()).toThrowError('Goal is already deleted');
    });
  });

  describe('checkIn', () => {
    it('should update progress', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);

      const checkInCommand = new CheckInGoalCommand({
        goalId: goal.getId(),
        userId: goal.getUserId(),
        progress: 50,
      });

      goal.checkIn(checkInCommand);

      expect(goal.getProgress()).toBe(50);
      expect(goal.getCompleted()).toBe(false);
    });

    it('should complete goal if progress is equal to target', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);

      const checkInCommand = new CheckInGoalCommand({
        goalId: goal.getId(),
        userId: goal.getUserId(),
        progress: 100,
      });

      goal.checkIn(checkInCommand);

      expect(goal.getProgress()).toBe(100);
      expect(goal.getCompleted()).toBe(true);
    });

    it('should not updated progress if progress is greater than target', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);

      const checkInCommand = new CheckInGoalCommand({
        goalId: goal.getId(),
        userId: goal.getUserId(),
        progress: 101,
      });

      expect(() => goal.checkIn(checkInCommand)).toThrowError('Progress cannot exceed target');
    });

    it('should not update progress if goal is completed', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.completeGoal();

      const checkInCommand = new CheckInGoalCommand({
        goalId: goal.getId(),
        userId: goal.getUserId(),
        progress: 50,
      });

      expect(() => goal.checkIn(checkInCommand)).toThrowError('Goal is completed');
    });

    it('should not update progress if goal is deleted', () => {
      const createGoalCommand = new CreateGoalCommand({
        userId: '123',
        name: 'test',
        target: 100,
      });

      goal.createGoal(createGoalCommand);
      goal.deleteGoal();

      const checkInCommand = new CheckInGoalCommand({
        goalId: goal.getId(),
        userId: goal.getUserId(),
        progress: 50,
      });

      expect(() => goal.checkIn(checkInCommand)).toThrowError('Goal is deleted');
    });
  });
});
