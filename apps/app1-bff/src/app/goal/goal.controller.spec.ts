import { Test, TestingModule } from '@nestjs/testing';
import { GoalController } from './goal.controller';
import { GoalsService } from './goals.service';

describe('GoalController', () => {
  let controller: GoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [{ provide: 'GOALS_SERVICE', useValue: {} }, GoalsService],
    }).compile();

    controller = module.get<GoalController>(GoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
