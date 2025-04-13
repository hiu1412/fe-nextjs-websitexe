import type { LucideIcon } from "lucide-react";
import {
  UserCircle,
  ShoppingBag,
  Heart,
  Calendar,
  LayoutDashboard,
  Car,
  ShoppingCart,
  Users,
  Newspaper
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  dropdownItems?: Array<{
    title: string;
    href: string;
  }>;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Trang chủ",
    href: "/"
  },
  {
    title: "Xe mới",
    href: "/cars"
  },
  {
    title: "Thương hiệu",
    href: "/brands"
  }
];

export const userNavItems: NavItem[] = [
  {
    title: "Hồ sơ",
    href: "/profile",
    icon: UserCircle
  },
  {
    title: "Đơn hàng của bạn",
    href: "/your-orders",
    icon: ShoppingBag
  },
  {
    title: "Xe yêu thích",
    href: "/cars/favorites",
    icon: Heart
  }
];

export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Quản lý xe",
    href: "/admin/cars",
    icon: Car
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart
  },
  {
    title: "Khách hàng",
    href: "/admin/customers",
    icon: Users
  },
  {
    title: "Lịch hẹn",
    href: "/admin/appointments",
    icon: Calendar
  },
  {
    title: "Tin tức",
    href: "/admin/news",
    icon: Newspaper
  }
];