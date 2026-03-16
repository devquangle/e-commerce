export const Role = {
  ADMIN: "ROLE_ADMIN",
  PRODUCT_MANAGER: "ROLE_PRODUCT_MANAGER",
  ORDER_MANAGER: "ROLE_ORDER_MANAGER",
  PROMOTION_MANAGER: "ROLE_PROMOTION_MANAGER",
  SUPPORT: "ROLE_SUPPORT",
  ACCOUNTANT: "ROLE_ACCOUNTANT",
  CONTENT_MANAGER: "ROLE_CONTENT_MANAGER",
  USER: "ROLE_USER",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

/* role hierarchy */
export const roleHierarchy: Record<RoleType, RoleType[]> = {
  [Role.ADMIN]: [
    Role.PRODUCT_MANAGER,
    Role.ORDER_MANAGER,
    Role.PROMOTION_MANAGER,
    Role.SUPPORT,
    Role.ACCOUNTANT,
    Role.CONTENT_MANAGER,
  ],

  [Role.PRODUCT_MANAGER]: [],
  [Role.ORDER_MANAGER]: [],
  [Role.PROMOTION_MANAGER]: [],
  [Role.SUPPORT]: [],
  [Role.ACCOUNTANT]: [],
  [Role.CONTENT_MANAGER]: [],
  [Role.USER]: [],
};

/* check role access */
export function hasRoleAccess(
  userRoles: RoleType[],
  requiredRole: RoleType
): boolean {
  const visited = new Set<RoleType>();

  const check = (role: RoleType): boolean => {
    if (role === requiredRole) return true;

    if (visited.has(role)) return false;
    visited.add(role);

    const children = roleHierarchy[role] ?? [];

    return children.some(check);
  };

  return userRoles.some(check);
}