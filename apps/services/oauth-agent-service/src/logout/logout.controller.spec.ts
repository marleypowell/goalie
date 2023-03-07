import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

describe('LogoutController', () => {
  let controller: LogoutController;

  let logoutServiceSpy: {
    getLogoutResponse: jest.Mock;
  };

  beforeEach(async () => {
    logoutServiceSpy = {
      getLogoutResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogoutController],
      providers: [{ provide: LogoutService, useValue: logoutServiceSpy }],
    }).compile();

    controller = module.get<LogoutController>(LogoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getLogoutResponse', () => {
    logoutServiceSpy.getLogoutResponse.mockReturnValue({
      url: 'logoutUrl',
      cookiesToSet: ['cookie1', 'cookie2'],
    });
    const req = { cookies: { cookie1: 'cookie1' } } as unknown as Request;
    const res = { set: jest.fn() } as unknown as Response;
    expect(controller.logout(req, res)).toEqual({
      url: 'logoutUrl',
    });
    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith('Set-Cookie', ['cookie1', 'cookie2']);
  });
});
