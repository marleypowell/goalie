import { IQuery } from '@nestjs/cqrs';

/**
 * The get users query. It is used to get all users.
 */
export class GetUsersQuery implements IQuery {}
