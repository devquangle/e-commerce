import { menuGroups } from "@/configs/admin.menu"
import { useAuth } from "@/context/useAuth"
import type { RoleType } from "@/types/role"
import { NavLink } from "react-router-dom"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function MenuItem() {

  const { userInfo } = useAuth()
  const roles = userInfo?.roles || []

  const [openGroup, setOpenGroup] = useState<number | null>(null)

  const hasAccess = (menuRoles?: RoleType[]) =>
    !menuRoles || menuRoles.some(r => roles.includes(r))

  const toggleGroup = (id: number, length: number) => {
    if (length <= 1) return
    setOpenGroup(openGroup === id ? null : id)
  }

  return (

    <ul className="space-y-3">

      {menuGroups.map(group => {

        const items = group.children.filter(i => hasAccess(i.role))
        if (!items.length) return null

        return (

          <li key={group.id}>
            <button
              onClick={() => toggleGroup(group.id, items.length)}
              className="flex w-full items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900 hover:text-indigo-600 transition-colors"
            >
              <span className="flex-1 text-left">{group.label}</span>

              {items.length > 1 && (
                <ChevronDown
                  size={14}
                  className={`ml-1 text-slate-700 transition-transform duration-200 ${
                    openGroup === group.id ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {(items.length === 1 || openGroup === group.id) && (
              <ul className="mt-1 space-y-1">
                {items.map(item => {
                  const Icon = item.icon

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path!}
                        className={({ isActive }) =>
                          [
                            "group flex items-center gap-3 px-3 py-2 text-sm rounded-lg border border-transparent transition-colors",
                            "hover:bg-slate-100 hover:text-indigo-600",
                            isActive
                              ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                              : "text-slate-900",
                          ].join(" ")
                        }
                      >
                        {Icon && (
                          <Icon
                            size={18}
                            className="text-slate-800 group-hover:text-indigo-600"
                          />
                        )}

                        <span className="flex-1 truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            )}

          </li>

        )

      })}

    </ul>

  )
}