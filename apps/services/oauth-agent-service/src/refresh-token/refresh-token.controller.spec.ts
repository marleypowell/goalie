import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;

  let refreshTokenServiceSpy: {
    refreshToken: jest.Mock;
  };

  beforeEach(async () => {
    refreshTokenServiceSpy = {
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [{ provide: RefreshTokenService, useValue: refreshTokenServiceSpy }],
    }).compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call refreshToken', async () => {
    refreshTokenServiceSpy.refreshToken.mockReturnValue(Promise.resolve({ cookiesToSet: ['cookie1', 'cookie2'] }));
    const req = { cookies: { cookie1: 'cookie1' } } as unknown as Request;
    const res = { set: jest.fn() } as unknown as Response;
    await controller.refreshToken(req, res);
    expect(res.set).toHaveBeenCalledWith('Set-Cookie', ['cookie1', 'cookie2']);
  });
});
