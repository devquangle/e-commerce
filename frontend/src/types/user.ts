import type { RoleType } from "./role";

export interface User {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  code: string;
  roles: RoleType[];
  image: string;
}
