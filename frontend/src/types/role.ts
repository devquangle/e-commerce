export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PRODUCT_MANAGER: "PRODUCT_MANAGER",
  ORDER_MANAGER: "ORDER_MANAGER",
  PROMOTION_MANAGER: "PROMOTION_MANAGER",
  SUPPORT: "SUPPORT",
  ACCOUNTANT: "ACCOUNTANT",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  CUSTOMER: "CUSTOMER",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const roleHierarchy: Record<RoleType, RoleType[]> = {/* role hierarchy */

  [Role.SUPER_ADMIN]: [
    Role.ADMIN,
    Role.PRODUCT_MANAGER,
    Role.ORDER_MANAGER,
    Role.PROMOTION_MANAGER,
    Role.SUPPORT,
    Role.ACCOUNTANT,
    Role.CONTENT_MANAGER,
  ],
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
  [Role.CUSTOMER]: [],
};

/* check role access */
export function hasRoleAccess(
  userRoles: RoleType[],
  requiredRole: RoleType,
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
