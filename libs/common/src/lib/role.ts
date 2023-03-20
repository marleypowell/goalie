/**
 * Roles available for authorization.
 * This is intended to be extended as business requirements demand.
 */
export const Role = {
  Admin: 'admin',
  Editor: 'editor',
} as const;

export type Role = typeof Role[keyof typeof Role];
