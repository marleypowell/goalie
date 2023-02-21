import { Test } from '@nestjs/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();

    service = app.get<JwtService>(JwtService);
  });

  describe('generateTokens', () => {
    it('should not throw', () => {
      expect(
        service.generateTokens({ userId: 'id', email: 'email@test.com' })
      ).resolves.not.toThrowError();
    });
  });
});
