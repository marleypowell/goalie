import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { LogoutService } from './logout.service';

describe('LogoutService', () => {
  let service: LogoutService;

  let cookieServiceSpy: {
    getAccessTokenCookie: jest.Mock;
    getLogoutCookies: jest.Mock;
  };
  let curityServiceSpy: {
    createLogoutRequestUrl: jest.Mock;
  };

  beforeEach(async () => {
    cookieServiceSpy = {
      getAccessTokenCookie: jest.fn(() => 'accessTokenCookie'),
      getLogoutCookies: jest.fn(() => ['authCookie', 'accessTokenCookie', 'refreshTokenCookie']),
    };

    curityServiceSpy = {
      createLogoutRequestUrl: jest.fn(
        () =>
          'https://localhost:8443/oauth2/logout?client_id=clientId&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A4200'
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: CurityService, useValue: curityServiceSpy },
      ],
    }).compile();

    service = module.get<LogoutService>(LogoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return logout response', () => {
    const response = service.getLogoutResponse({});
    expect(response).toEqual({
      url: 'https://localhost:8443/oauth2/logout?client_id=clientId&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A4200',
      cookiesToSet: ['authCookie', 'accessTokenCookie', 'refreshTokenCookie'],
    });
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledWith({});
    expect(curityServiceSpy.createLogoutRequestUrl).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getLogoutCookies).toHaveBeenCalledTimes(1);
  });

  it('should throw unauthorized exception when no access token cookie', () => {
    cookieServiceSpy.getAccessTokenCookie.mockReturnValue(undefined);
    expect(() => service.getLogoutResponse({})).toThrowError(new UnauthorizedException('Not logged in'));
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledWith({});
    expect(curityServiceSpy.createLogoutRequestUrl).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getLogoutCookies).toHaveBeenCalledTimes(0);
  });
});
