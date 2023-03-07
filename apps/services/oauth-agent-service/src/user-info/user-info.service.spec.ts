import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { UserInfoService } from './user-info.service';

describe(UserInfoService.name, () => {
  let service: UserInfoService;

  let cookieServiceSpy: {
    getAccessTokenCookie: jest.Mock;
  };
  let curityServiceSpy: {
    getUserInfo: jest.Mock;
  };

  beforeEach(async () => {
    cookieServiceSpy = {
      getAccessTokenCookie: jest.fn(() => 'accessTokenCookie'),
    };

    curityServiceSpy = {
      getUserInfo: jest.fn(() => of({ sub: '123', name: 'John Doe', email: 'john.doe@gmail.com' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInfoService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: CurityService, useValue: curityServiceSpy },
      ],
    }).compile();

    service = module.get<UserInfoService>(UserInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user info', async () => {
    const userInfo = await service.getUserInfo({});
    expect(userInfo).toEqual({ sub: '123', name: 'John Doe', email: 'john.doe@gmail.com' });
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getUserInfo).toHaveBeenCalledTimes(1);
    expect(curityServiceSpy.getUserInfo).toHaveBeenCalledWith('accessTokenCookie');
  });

  it('should throw unauthorized exception when no access token cookie', async () => {
    cookieServiceSpy.getAccessTokenCookie.mockReturnValue(undefined);
    await expect(service.getUserInfo({})).rejects.toThrowError(
      new UnauthorizedException('No access token cookie was supplied in a call to get user info')
    );
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getAccessTokenCookie).toHaveBeenCalledWith({});
    expect(curityServiceSpy.getUserInfo).toHaveBeenCalledTimes(0);
  });
});
