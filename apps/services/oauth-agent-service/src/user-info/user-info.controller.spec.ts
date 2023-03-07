import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserInfoController } from './user-info.controller';
import { UserInfoService } from './user-info.service';

describe(UserInfoController.name, () => {
  let controller: UserInfoController;

  let userInfoServiceSpy: {
    getUserInfo: jest.Mock;
  };

  beforeEach(async () => {
    userInfoServiceSpy = {
      getUserInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInfoController],
      providers: [{ provide: UserInfoService, useValue: userInfoServiceSpy }],
    }).compile();

    controller = module.get<UserInfoController>(UserInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getUserInfo', async () => {
    userInfoServiceSpy.getUserInfo.mockReturnValue(
      Promise.resolve({ sub: '123', name: 'John Doe', email: 'john.doe@gmail.com' })
    );
    const req = { cookies: { cookie1: 'cookie1' } } as unknown as Request;
    await expect(controller.getUserInfo(req)).resolves.toEqual({
      sub: '123',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
    });
  });
});
