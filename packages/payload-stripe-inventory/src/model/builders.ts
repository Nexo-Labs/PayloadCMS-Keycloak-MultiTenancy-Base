import { CustomerInventory, UserInventory } from "../types/index.js";

export const generateUserInventory = (): UserInventory => ({
  unlocks: [],
  favorites: [],
});

export const generateCustomerInventory = (): CustomerInventory => ({
  subscriptions: {},
  products: {},
  payments: {},
  invoices: {},
});
