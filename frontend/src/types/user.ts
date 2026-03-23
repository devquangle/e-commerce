import type { RoleType } from "./role";
import type {PermissionType } from './permission';

export interface User {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  code: string;
  roles: RoleType[];
  Permissions: PermissionType[];
  image: string;
}
