import { Test, TestingModule } from '@nestjs/testing';
import { CookieService } from '../lib/cookie.service';
import { ClaimsService } from './claims.service';

describe('ClaimsService', () => {
  let service: ClaimsService;

  let cookieServiceSpy: {
    getIdTokenCookie: jest.Mock;
  };

  beforeEach(async () => {
    cookieServiceSpy = {
      getIdTokenCookie: jest.fn(
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimsService, { provide: CookieService, useValue: cookieServiceSpy }],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get claims from id token', () => {
    cookieServiceSpy.getIdTokenCookie.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    const claims = service.getClaims({});
    expect(claims).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledWith({});
  });

  it('should throw an error if no id token cookie is supplied', () => {
    cookieServiceSpy.getIdTokenCookie.mockReturnValue(undefined);
    expect(() => service.getClaims({})).toThrow('No ID token cookie was supplied in a call to get claims');
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledWith({});
  });

  it('should throw an error if the id token does not have 3 parts', () => {
    cookieServiceSpy.getIdTokenCookie.mockReturnValue('invalid');
    expect(() => service.getClaims({})).toThrow('ID token is not a valid JWT');
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledWith({});
  });

  it('should throw an error if the id token is not a valid JWT', () => {
    cookieServiceSpy.getIdTokenCookie.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    expect(() => service.getClaims({})).toThrow('ID token is not a valid JWT');
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledTimes(1);
    expect(cookieServiceSpy.getIdTokenCookie).toHaveBeenCalledWith({});
  });
});
