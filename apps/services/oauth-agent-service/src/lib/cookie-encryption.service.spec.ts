import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { CookieEncryptionService } from './cookie-encryption.service';

describe(CookieEncryptionService.name, () => {
  let service: CookieEncryptionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, CookieEncryptionService],
    }).compile();

    service = module.get<CookieEncryptionService>(CookieEncryptionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt a cookie', () => {
    jest.spyOn(configService, 'get').mockReturnValue(crypto.randomBytes(32));
    const encryptedCookie = service.encrypt('test');
    expect(encryptedCookie).not.toEqual('test');
    const decryptedCookie = service.decrypt(encryptedCookie);
    expect(decryptedCookie).toEqual('test');
  });

  it('should throw an error when the cookie is invalid', () => {
    jest.spyOn(configService, 'get').mockReturnValue(crypto.randomBytes(32));
    expect(() => service.decrypt('invalid')).toThrowError('Access denied due to invalid request details');
  });

  it('should throw an error when the encryption key is invalid', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(crypto.randomBytes(32));
    const encryptedCookie = service.encrypt('test');
    jest.spyOn(configService, 'get').mockReturnValueOnce(crypto.randomBytes(32));
    expect(() => service.decrypt(encryptedCookie)).toThrowError('Access denied due to invalid request details');
  });

  it('should get an encrypted cookie', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce({ httpOnly: true, sameSite: true, path: '/' });
    jest.spyOn(configService, 'get').mockReturnValue(crypto.randomBytes(32));
    const encryptedCookie = service.getEncryptedCookie('test', 'test');
    expect(encryptedCookie).not.toEqual('test');
    expect(encryptedCookie).toContain('test=');
    expect(encryptedCookie).toContain('; Path=/; HttpOnly; SameSite=Strict');
  });

  it('should get an encrypted cookie with additional options', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce({ httpOnly: true, sameSite: true, path: '/' });
    jest.spyOn(configService, 'get').mockReturnValue(crypto.randomBytes(32));
    const encryptedCookie = service.getEncryptedCookie('test', 'test', { path: '/test' });
    expect(encryptedCookie).not.toEqual('test');
    expect(encryptedCookie).toContain('test=');
    expect(encryptedCookie).toContain('; Path=/test; HttpOnly; SameSite=Strict');
  });
});
