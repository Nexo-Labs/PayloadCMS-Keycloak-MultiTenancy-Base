import type { Permission } from "../types/index.js";

export const getPermissionsSlugs = ({
  permissions,
}: {
  permissions?: (number | Permission)[] | null | undefined;
}) => {
  return (
    permissions?.mapNotNull(p => (typeof p === "number" ? null : p.slug)) ?? []
  );
};
