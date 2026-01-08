import { BaseUser } from "../types/index.js";
import { permissionSlugs } from "./constants.js";

/**
 * Verifica si un usuario puede desbloquear un elemento basado en sus permisos y límites semanales
 * @param user Usuario base
 * @param permissions Permisos requeridos para el elemento
 * @returns Booleano indicando si el usuario puede desbloquear el elemento
 */
export const checkIfUserCanUnlockQuery = (
  user: BaseUser,
  permissions: string[]
): boolean => {
  return (
    permissions
      .flatMap(item => item.split(" "))
      .includes(permissionSlugs.freemium) &&
    !permissions.includes(permissionSlugs.free)
  );
};
