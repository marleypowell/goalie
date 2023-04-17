import { Request } from 'express';
import { User } from '../auth/user.model';

/**
 * Extends the Express Request interface with a user property
 */
export interface ApiRequest extends Request {
  user: User;
}
