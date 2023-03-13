import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

describe('ClaimsController', () => {
  let controller: ClaimsController;

  let claimsServiceSpy: {
    getClaims: jest.Mock;
  };

  beforeEach(async () => {
    claimsServiceSpy = {
      getClaims: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [{ provide: ClaimsService, useValue: claimsServiceSpy }],
    }).compile();

    controller = module.get<ClaimsController>(ClaimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getClaims', () => {
    claimsServiceSpy.getClaims.mockReturnValue({
      sub: '123',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
    });
    const req = { cookies: { cookie1: 'cookie1' } } as unknown as Request;
    expect(controller.getClaims(req)).toEqual({
      sub: '123',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
    });
    expect(claimsServiceSpy.getClaims).toHaveBeenCalledTimes(1);
    expect(claimsServiceSpy.getClaims).toHaveBeenCalledWith(req.cookies);
  });
});
