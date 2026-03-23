import type { MenuGroup } from "@/types/menu-admin-type"
import { Role } from "@/types/role"

import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Star,
  Megaphone,
  Image,
  MessageCircle,
  BarChart3,
  Flame,
  Users
} from "lucide-react"

export const menuGroups: MenuGroup[] = [

{
  id: 1,
  label: "Dashboard",
  children: [
    {
      id: 11,
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      role:  [Role.SUPER_ADMIN, Role.ADMIN]
    }
  ]
},

{
  id: 2,
  label: "SẢN PHẨM",
  children: [
    {
      id: 21,
      label: "Sản phẩm",
      path: "/admin/products",
      icon: Package,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER]
    },
    {
      id: 22,
      label: "Thể loại",
      path: "/admin/genres",
      icon: FolderTree,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.PRODUCT_MANAGER]
    },
  ]
},

{
  id: 3,
  label: "ĐƠN HÀNG",
  children: [
    {
      id: 31,
      label: "Đơn hàng",
      path: "/admin/orders",
      icon: ShoppingCart,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.ORDER_MANAGER]
    },
    {
      id: 32,
      label: "Đánh giá",
      path: "/admin/reviews",
      icon: Star,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.ORDER_MANAGER]
    }
  ]
},

{
  id: 4,
  label: "MARKETING",
  children: [
    {
      id: 41,
      label: "Giảm giá",
      path: "/admin/promotions",
      icon: Megaphone,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.PROMOTION_MANAGER]
    },
    {
      id: 42,
      label: "Banner",
      path: "/admin/banners",
      icon: Image,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_MANAGER]
    }
  ]
},

{
  id: 5,
  label: "HỖ TRỢ",
  children: [
    {
      id: 51,
      label: "Chat",
      path: "/admin/chats",
      icon: MessageCircle,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT]
    },
  ]
},

{
  id: 6,
  label: "THỐNG KÊ",
  children: [
    {
      id: 61,
      label: "Doanh thu",
      path: "/admin/analytics/revenue",
      icon: BarChart3,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT]
    },
    {
      id: 62,
      label: "Sách bán chạy",
      path: "/admin/analytics/best-sellers",
      icon: Flame,
      role: [Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT]
    }
  ]
},

{
  id: 7,
  label: "HỆ THỐNG",
  children: [
    {
      id: 71,
      label: "Tài khoản",
      path: "/admin/users",
      icon: Users,
      role: [Role.SUPER_ADMIN, Role.ADMIN]
    }
  ]
}

]