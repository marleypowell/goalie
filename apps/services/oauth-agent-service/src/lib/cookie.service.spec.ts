import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CookieEncryptionService } from './cookie-encryption.service';
import { CookieService } from './cookie.service';

describe(CookieService.name, () => {
  let service: CookieService;
  let cookieEncryptionService: CookieEncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieService, ConfigService, CookieEncryptionService],
    }).compile();

    service = module.get<CookieService>(CookieService);
    cookieEncryptionService = module.get<CookieEncryptionService>(CookieEncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cookies from token response', () => {
    const createEncryptedCookieSpy = jest
      .spyOn(cookieEncryptionService, 'createEncryptedCookie')
      .mockImplementation((name, value) => `${name}=${value}`);

    const cookies = service.getTokenResponseCookies(
      {
        id_token: 'idToken',
        token_type: 'tokenType',
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        scope: 'scope',
        expires_in: 1,
      },
      true
    );

    expect(cookies).toEqual([
      'undefined-at=accessToken',
      expect.stringContaining('undefined-login=; Expires='),
      'undefined-refresh-token=refreshToken',
      'undefined-id-token=idToken',
    ]);
    expect(createEncryptedCookieSpy).toHaveBeenCalledTimes(3);
    expect(createEncryptedCookieSpy).toHaveBeenCalledWith('undefined-at', 'accessToken');
    expect(createEncryptedCookieSpy).toHaveBeenCalledWith('undefined-refresh-token', 'refreshToken', {
      path: 'undefined/refresh-token',
    });
    expect(createEncryptedCookieSpy).toHaveBeenCalledWith('undefined-id-token', 'idToken', {
      path: 'undefined/claims',
    });
  });

  it('should get cookies from token response without the temp login cookie', () => {
    jest
      .spyOn(cookieEncryptionService, 'createEncryptedCookie')
      .mockImplementation((name, value) => `${name}=${value}`);

    const cookies = service.getTokenResponseCookies(
      {
        id_token: 'idToken',
        token_type: 'tokenType',
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        scope: 'scope',
        expires_in: 1,
      },
      false
    );

    expect(cookies).toEqual([
      'undefined-at=accessToken',
      'undefined-refresh-token=refreshToken',
      'undefined-id-token=idToken',
    ]);
  });

  it('should create a temp login data cookie', () => {
    jest.spyOn(cookieEncryptionService, 'createEncryptedCookie').mockReturnValueOnce('encryptedCookie');
    const codeVerifier = 'codeVerifier';
    const state = 'state';
    const cookie = service.createTempLoginDataCookie(codeVerifier, state);
    expect(cookie).toEqual('encryptedCookie');
    expect(cookieEncryptionService.createEncryptedCookie).toHaveBeenCalledTimes(1);
    expect(cookieEncryptionService.createEncryptedCookie).toHaveBeenCalledWith(
      'undefined-login',
      '{"codeVerifier":"codeVerifier","state":"state"}'
    );
  });

  it('should get a temp login data', () => {
    const decryptSpy = jest
      .spyOn(cookieEncryptionService, 'decrypt')
      .mockReturnValueOnce('{"codeVerifier":"codeVerifier","state":"state"}');
    const cookies = { 'undefined-login': 'encryptedCookie' };
    const cookie = service.getTempLoginData(cookies);
    expect(cookie).toEqual({ codeVerifier: 'codeVerifier', state: 'state' });
    expect(decryptSpy).toHaveBeenCalledTimes(1);
    expect(decryptSpy).toHaveBeenCalledWith('encryptedCookie');
  });

  it('should get access token cookie', () => {
    const decryptSpy = jest.spyOn(cookieEncryptionService, 'decrypt').mockReturnValueOnce('accessToken');
    const cookies = { 'undefined-at': 'encryptedCookie' };
    const cookie = service.getAccessTokenCookie(cookies);
    expect(cookie).toEqual('accessToken');
    expect(decryptSpy).toHaveBeenCalledTimes(1);
    expect(decryptSpy).toHaveBeenCalledWith('encryptedCookie');
  });

  it('should get refresh token cookie', () => {
    const decryptSpy = jest.spyOn(cookieEncryptionService, 'decrypt').mockReturnValueOnce('refreshToken');
    const cookies = { 'undefined-refresh-token': 'encryptedCookie' };
    const cookie = service.getRefreshTokenCookie(cookies);
    expect(cookie).toEqual('refreshToken');
    expect(decryptSpy).toHaveBeenCalledTimes(1);
    expect(decryptSpy).toHaveBeenCalledWith('encryptedCookie');
  });

  it('should get id token cookie', () => {
    const decryptSpy = jest.spyOn(cookieEncryptionService, 'decrypt').mockReturnValueOnce('idToken');
    const cookies = { 'undefined-id-token': 'encryptedCookie' };
    const cookie = service.getIdTokenCookie(cookies);
    expect(cookie).toEqual('idToken');
    expect(decryptSpy).toHaveBeenCalledTimes(1);
    expect(decryptSpy).toHaveBeenCalledWith('encryptedCookie');
  });

  it('should get logout cookies', () => {
    const cookies = service.getLogoutCookies();

    expect(cookies).toEqual([
      expect.stringContaining('undefined-refresh-token=; Expires='),
      expect.stringContaining('undefined-at=; Expires='),
      expect.stringContaining('undefined-id-token=; Expires='),
    ]);
  });
});
