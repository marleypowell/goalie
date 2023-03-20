import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { CaslFactory } from './casl.factory';
import { CaslInterceptor } from './interceptors/casl.interceptor';
import { DtoUserIdInterceptor } from './interceptors/dto-user-id.interceptor';

@Module({
  controllers: [],
  providers: [CaslInterceptor, DtoUserIdInterceptor],
  exports: [],
})
export class NestAuthModule {
  public static register(caslFactory: Type<CaslFactory>): DynamicModule {
    const providers: Provider[] = [
      {
        provide: CaslFactory,
        useClass: caslFactory,
      },
    ];

    return {
      module: NestAuthModule,
      providers: providers,
      exports: providers,
    };
  }
}
