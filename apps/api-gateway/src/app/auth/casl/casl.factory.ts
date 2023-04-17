import { Ability, AbilityBuilder, AbilityClass, InferSubjects } from '@casl/ability';
import { Action, Role } from '@goalie/common';
import { CaslFactory, RequestUser } from '@goalie/nest-auth';
import { Goal, GoalActivity } from '@goalie/shared/goals';

export type AppSubjects = InferSubjects<typeof Goal | typeof GoalActivity, true> | 'All';
export type AppAbility = Ability<[Action, AppSubjects]>;
const AppAbility = Ability as AbilityClass<AppAbility>;

/**
 * The CASL auth factory.
 */
export class AppCaslFactory extends CaslFactory {
  /**
   * Creates the ability for the user.
   * @param user The user
   * @returns The ability
   */
  public createAbility(user: RequestUser<Role>): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(AppAbility);

    if (user.roles.includes(Role.Admin)) {
      builder.can('manage', 'All');
      builder.can(['create', 'read', 'update', 'delete', 'manage'], ['Goal']);
    } else {
      builder.can(['create', 'read', 'update', 'delete'], ['Goal'], { userId: user.userId });
    }

    return new AppAbility(builder.rules);
  }
}
