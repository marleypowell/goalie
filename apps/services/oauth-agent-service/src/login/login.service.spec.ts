import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { LoginService } from './login.service';

describe(LoginService.name, () => {
  let service: LoginService;

  let cookieServiceSpy: {
    createTempLoginDataCookie: jest.Mock;
    getTempLoginData: jest.Mock;
    getTokenResponseCookies: jest.Mock;
    getAccessTokenCookie: jest.Mock;
  };
  let curityServiceSpy: {
    createAuthorizationRequestUrl: jest.Mock;
    getToken: jest.Mock;
  };

  beforeEach(async () => {
    cookieServiceSpy = {
      createTempLoginDataCookie: jest.fn(() => 'tempLoginDataCookie'),
      getTempLoginData: jest.fn(() => ({
        codeVerifier: 'codeVerifier',
        state: 'state',
      })),
      getTokenResponseCookies: jest.fn(() => ['accessTokenCookie', 'refreshTokenCookie']),
      getAccessTokenCookie: jest.fn(() => 'accessTokenCookie'),
    };

    curityServiceSpy = {
      createAuthorizationRequestUrl: jest.fn(() => 'https://localhost:8443/oauth2/authorize'),
      getToken: jest.fn(() =>
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
      imports: [HttpModule],
      providers: [
        LoginService,
        { provide: CurityService, useValue: curityServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start the login flow', async () => {
    const result = await service.loginStart();
    expect(result).toEqual({
      authorizationRequestUrl: 'https://localhost:8443/oauth2/authorize',
      tempLoginDataCookie: 'tempLoginDataCookie',
    });
    expect(cookieServiceSpy.createTempLoginDataCookie).toHaveBeenCalledTimes(1);
    expect(curityServiceSpy.createAuthorizationRequestUrl).toHaveBeenCalledTimes(1);
  });

  it('should finish the login flow', async () => {
    const pageUrl = 'http://localhost:4200/login?code=code&state=state';
    const result = await service.loginEnd(pageUrl, {});
    expect(result).toEqual({
      isLoggedIn: true,
      handled: true,
      cookiesToSet: ['accessTokenCookie', 'refreshTokenCookie'],
    });
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getToken).toHaveBeenCalledTimes(1);
    expect(curityServiceSpy.getToken).toHaveBeenCalledWith('code', 'codeVerifier');
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledWith(
      {
        access_token: 'access_token',
        expires_in: 1,
        id_token: 'id_token',
        refresh_token: 'refresh_token',
        scope: 'scope',
        token_type: 'token_type',
      },
      true
    );
  });

  it('should not finish the login flow if the state is invalid', async () => {
    const pageUrl = 'http://localhost:4200/login?code=code&state=invalidState';
    await expect(service.loginEnd(pageUrl, {})).rejects.toThrowError(
      'State parameter mismatch when completing a login'
    );
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getToken).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(0);
  });

  it('should not finish the login flow if temp login data is missing', async () => {
    cookieServiceSpy.getTempLoginData.mockReturnValue(undefined);
    const pageUrl = 'http://localhost:4200/login?code=code&state=state';
    await expect(service.loginEnd(pageUrl, {})).rejects.toThrowError('Missing temp data when completing a login');
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getToken).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(0);
  });

  it('should not finish the login flow if the code is missing', async () => {
    const pageUrl = 'http://localhost:4200/login?state=state';
    const result = await service.loginEnd(pageUrl, {});
    expect(result).toEqual({
      isLoggedIn: true,
      handled: false,
    });
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledTimes(0);
    expect(curityServiceSpy.getToken).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(0);
  });

  it('should not finish the login flow if the state is missing', async () => {
    const pageUrl = 'http://localhost:4200/login?code=code';
    const result = await service.loginEnd(pageUrl, {});
    expect(result).toEqual({
      isLoggedIn: true,
      handled: false,
    });
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledTimes(0);
    expect(curityServiceSpy.getToken).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(0);
  });

  it('should not finish the login flow if url has an error', async () => {
    const pageUrl = 'http://localhost:4200/login?state=state&error=error&error_description=error_description';
    await expect(service.loginEnd(pageUrl, {})).rejects.toThrowError('error_description');
    expect(cookieServiceSpy.getTempLoginData).toHaveBeenCalledTimes(0);
    expect(curityServiceSpy.getToken).toHaveBeenCalledTimes(0);
    expect(cookieServiceSpy.getTokenResponseCookies).toHaveBeenCalledTimes(0);
  });
});
