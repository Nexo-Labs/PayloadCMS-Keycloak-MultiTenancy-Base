import { BaseUser, UserInventory } from "../types/index.js";
/**
 * Cuenta cuántos elementos ha desbloqueado el usuario en los últimos 7 días
 * @param user Usuario base
 * @returns Número de elementos desbloqueados en los últimos 7 días
 */

export const countWeeklyUnlocksQuery = (
  user: BaseUser<UserInventory>
): number => {
  const inventory = user.inventory;
  if (!inventory || !inventory.unlocks || inventory.unlocks.length === 0) {
    return 0;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return inventory.unlocks.filter(
    unlock => new Date(unlock.dateUnlocked) >= sevenDaysAgo
  ).length;
};
