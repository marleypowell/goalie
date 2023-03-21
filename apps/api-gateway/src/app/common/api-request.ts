import { Request } from 'express';
import { User } from '../auth/user.model';

export interface ApiRequest extends Request {
  user: User;
}
