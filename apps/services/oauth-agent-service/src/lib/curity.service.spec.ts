import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { firstValueFrom, of } from 'rxjs';
import { CurityService } from './curity.service';

describe(CurityService.name, () => {
  let service: CurityService;
  let configService: ConfigService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CurityService, ConfigService],
    }).compile();

    service = module.get<CurityService>(CurityService);
    configService = module.get<ConfigService>(ConfigService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a token', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('https://localhost:8443/oauth2/token');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientId');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientSecret');
    jest.spyOn(configService, 'get').mockReturnValueOnce('http://localhost:4200/login');

    const data = { access_token: 'accessToken', id_token: 'idToken' };
    const postSpy = jest.spyOn(http, 'post').mockReturnValue(of({ data } as AxiosResponse));

    const response = await firstValueFrom(service.getToken('code', 'codeVerifier'));

    expect(response).toEqual(data);
    expect(postSpy).toHaveBeenCalledWith(
      'https://localhost:8443/oauth2/token',
      'grant_type=authorization_code&redirect_uri=http://localhost:4200/login&code=code&code_verifier=codeVerifier',
      expect.objectContaining({
        headers: {
          Authorization: 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    );
  });

  it('should throw an error when the token endpoint is not configured', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);
    await expect(firstValueFrom(service.getToken('code', 'codeVerifier'))).rejects.toThrow();
  });

  it('should get a refresh token', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('https://localhost:8443/oauth2/token');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientId');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientSecret');

    const data = { access_token: 'accessToken', id_token: 'idToken' };
    const postSpy = jest.spyOn(http, 'post').mockReturnValue(of({ data } as AxiosResponse));

    const refreshToken = 'refreshToken';

    const response = await firstValueFrom(service.getRefreshToken(refreshToken));
    expect(response).toEqual(data);
    expect(postSpy).toHaveBeenCalledWith(
      'https://localhost:8443/oauth2/token',
      'grant_type=refresh_token&refresh_token=refreshToken',
      expect.objectContaining({
        headers: {
          Authorization: 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    );
  });

  it('should throw an error when the token endpoint is not configured', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);
    await expect(firstValueFrom(service.getRefreshToken('refreshToken'))).rejects.toThrow();
  });

  it('should get the user info', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('https://localhost:8443/oauth2/userinfo');

    const data = { id: 'userId' };
    const postSpy = jest.spyOn(http, 'post').mockReturnValue(of({ data } as AxiosResponse));

    const accessToken = 'accessToken';

    const response = await firstValueFrom(service.getUserInfo(accessToken));
    expect(response).toEqual(data);
    expect(postSpy).toHaveBeenCalledWith(
      'https://localhost:8443/oauth2/userinfo',
      null,
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer accessToken',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    );
  });

  it('should throw an error when the userinfo endpoint is not configured', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);
    await expect(firstValueFrom(service.getUserInfo('accessToken'))).rejects.toThrow();
  });

  it('should create authorization request url', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('https://localhost:8443/oauth2/authorize');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientId');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientSecret');
    jest.spyOn(configService, 'get').mockReturnValueOnce('scope');
    const url = service.createAuthorizationRequestUrl('state', 'codeVerifier');
    expect(url).toContain(
      'https://localhost:8443/oauth2/authorize?client_id=clientId&redirect_uri=clientSecret&response_type=code&state=state&code_challenge='
    );
    expect(url).toContain('&code_challenge_method=S256&scope=scope');
  });

  it('should create logout request url', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('https://localhost:8443/oauth2/logout');
    jest.spyOn(configService, 'get').mockReturnValueOnce('http://localhost:4200');
    jest.spyOn(configService, 'get').mockReturnValueOnce('clientId');
    const url = service.createLogoutRequestUrl();
    expect(url).toEqual(
      'https://localhost:8443/oauth2/logout?client_id=clientId&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A4200'
    );
  });
});
