import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  let cookieServiceSpy: {
    getRefreshTokenCookie: jest.Mock;
    getTokenResponseCookies: jest.Mock;
  };
  let curityServiceSpy: {
    getRefreshToken: jest.Mock;
  };

  beforeEach(async () => {
    cookieServiceSpy = {
      getRefreshTokenCookie: jest.fn(() => 'refreshTokenCookie'),
      getTokenResponseCookies: jest.fn(() => ['accessTokenCookie', 'refreshTokenCookie']),
    };

    curityServiceSpy = {
      getRefreshToken: jest.fn(() =>
        of({
          id_token: 'id_token',
          token_type: 'token_type',
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          scope: 'scope',
          expires_in: 1,
        })
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: CurityService, useValue: curityServiceSpy },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cookies to set', async () => {
    const response = await service.refreshToken({});
    expect(response).toEqual({
      cookiesToSet: ['accessTokenCookie', 'refreshTokenCookie'],
    });
    expect(cookieServiceSpy.getRefreshTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getRefreshTokenCookie).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getRefreshToken).toHaveBeenCalledTimes(1);
    expect(curityServiceSpy.getRefreshToken).toHaveBeenCalledWith('refreshTokenCookie');
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledWith(
      {
        id_token: 'id_token',
        token_type: 'token_type',
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        scope: 'scope',
        expires_in: 1,
      },
      false
    );
  });

  it('should throw unauthorized exception when no refresh token cookie', async () => {
    cookieServiceSpy.getRefreshTokenCookie.mockReturnValue(undefined);
    await expect(service.refreshToken({})).rejects.toThrowError(
      new UnauthorizedException('No refresh token cookie was supplied in a call to refresh token')
    );
    expect(cookieServiceSpy.getRefreshTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getRefreshTokenCookie).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getRefreshToken).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(0);
  });
});
