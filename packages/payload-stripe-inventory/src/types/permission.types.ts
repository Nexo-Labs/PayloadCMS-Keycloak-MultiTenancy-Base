import type { Customer } from './customer.types.js';

export interface Permission {
  id: number;
  slug?: string | null;
  singular_name: string;
  updatedAt: string;
  createdAt: string;
}

export interface WithPermissions {
  permissions?: (number | Permission)[] | null;
}

export interface Subscription {
  status?: string;
}

export interface BaseUser<T = any> {
  id: string | number;
  name?: string;
  email?: string;
  customer?: Customer | null;
  roles?: string[];
  inventory?: T;
  [key: string]: any;
}

export interface User extends BaseUser {}