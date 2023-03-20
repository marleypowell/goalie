export * from './goals.service';
export * from './goals.serviceInterface';
export * from './health.service';
export * from './health.serviceInterface';
import { GoalsService } from './goals.service';
import { HealthService } from './health.service';
export const APIS = [GoalsService, HealthService];
