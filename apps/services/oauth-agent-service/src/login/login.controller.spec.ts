import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

describe('LoginController', () => {
  let controller: LoginController;

  let loginServiceSpy: {
    loginStart: jest.Mock;
    loginEnd: jest.Mock;
  };

  beforeEach(async () => {
    loginServiceSpy = {
      loginStart: jest.fn(),
      loginEnd: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [{ provide: LoginService, useValue: loginServiceSpy }],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call loginStart', () => {
    loginServiceSpy.loginStart.mockReturnValue({
      authorizationRequestUrl: 'authorizationRequestUrl',
      tempLoginDataCookie: 'tempLoginDataCookie',
    });
    const res = { set: jest.fn() } as unknown as Response;
    expect(controller.loginStart(res, { path: '/home' })).toEqual({
      authorizationRequestUrl: 'authorizationRequestUrl',
    });
    expect(loginServiceSpy.loginStart).toHaveBeenCalledTimes(1);
    expect(loginServiceSpy.loginStart).toHaveBeenCalledWith('/home');
    expect(res.set).toHaveBeenCalledWith('Set-Cookie', 'tempLoginDataCookie');
  });

  it('should call loginEnd', async () => {
    loginServiceSpy.loginEnd.mockReturnValue(
      Promise.resolve({
        cookiesToSet: ['cookie1', 'cookie2'],
        handled: true,
        isLoggedIn: true,
      })
    );
    const req = { cookies: { cookie1: 'cookie1' } } as unknown as Request;
    const res = { set: jest.fn() } as unknown as Response;
    await expect(controller.loginEnd(req, res, { pageUrl: '' })).resolves.toEqual({
      handled: true,
      isLoggedIn: true,
    });
    expect(loginServiceSpy.loginEnd).toHaveBeenCalledTimes(1);
    expect(loginServiceSpy.loginEnd).toHaveBeenCalledWith('', { cookie1: 'cookie1' });
    expect(res.set).toHaveBeenCalledWith('Set-Cookie', ['cookie1', 'cookie2']);
  });
});
