export * from './claims.service';
export * from './claims.serviceInterface';
export * from './health.service';
export * from './health.serviceInterface';
export * from './login.service';
export * from './login.serviceInterface';
export * from './logout.service';
export * from './logout.serviceInterface';
export * from './refresh-token.service';
export * from './refresh-token.serviceInterface';
export * from './user-info.service';
export * from './user-info.serviceInterface';
import { ClaimsService } from './claims.service';
import { HealthService } from './health.service';
import { LoginService } from './login.service';
import { LogoutService } from './logout.service';
import { RefreshTokenService } from './refresh-token.service';
import { UserInfoService } from './user-info.service';
export const APIS = [ClaimsService, HealthService, LoginService, LogoutService, RefreshTokenService, UserInfoService];