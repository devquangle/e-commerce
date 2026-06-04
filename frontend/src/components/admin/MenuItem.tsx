import { menuGroups } from "@/components/admin/admin.menu"
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
              className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <span className="flex-1 text-left">{group.label}</span>

              {items.length > 1 && (
                <ChevronDown
                  size={12}
                  className={`ml-1 text-slate-500 transition-transform duration-200 ${
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
                            "group flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all duration-200 border-l-2",
                            isActive
                              ? "bg-indigo-50 text-indigo-600 border-l-indigo-500 shadow-sm shadow-indigo-100/50"
                              : "text-slate-600 border-l-transparent hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1",
                          ].join(" ")
                        }
                      >
                        {Icon && (
                          <Icon
                            size={16}
                            className="text-current transition-colors shrink-0"
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