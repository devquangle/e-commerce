import type { RoleType } from "./role"

export type MenuItem = {
  id: number
  label: string
  path?: string
  role?: RoleType[]
  icon?: React.ElementType
}

export type MenuGroup = {
  id: number
  label: string
  children: MenuItem[]
}