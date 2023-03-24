import { CaslFactory } from '@goalie/nest-auth';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCaslFactory } from '../auth/casl/casl.factory';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

describe('GoalsController', () => {
  let controller: GoalsController;
  let goalsServiceSpy: { [key in keyof GoalsService]?: jest.Mock };

  beforeEach(async () => {
    goalsServiceSpy = {
      create: jest.fn(),
      getAll: jest.fn(),
      get: jest.fn(),
      getActivity: jest.fn(),
      complete: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [
        { provide: GoalsService, useValue: goalsServiceSpy },
        { provide: CaslFactory, useClass: AppCaslFactory },
      ],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
