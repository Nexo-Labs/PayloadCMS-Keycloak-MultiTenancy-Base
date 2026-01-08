import { BaseUser, Permission } from "../types/index.js";
import { permissionSlugs } from "./constants.js";
import { evalPermissionByRoleQuery } from "./eval-permission-by-role-query.js";
import { getPermissionsSlugs } from "./permissions.js";

/**
 * Filtra contenido basado en los permisos del usuario
 */
export const fetchPermittedContentQuery = <T extends BaseUser, C>(
  user: T | null | undefined,
  permissions: (Permission | number)[] | null | undefined,
  content: C,
  freeContent: C | null = null
): C | null => {
  const permissionsSlugs = getPermissionsSlugs({ permissions });
  const isFreeContent = permissionsSlugs.includes(permissionSlugs.free);
  const hasPermission = evalPermissionByRoleQuery({
    user,
    permissions: permissionsSlugs,
  });

  if (isFreeContent) {
    return content;
  }

  if (hasPermission) {
    return content;
  }

  return freeContent;
};
