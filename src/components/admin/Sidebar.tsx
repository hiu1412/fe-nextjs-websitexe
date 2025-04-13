import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/hooks/auth";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Thống kê",
    href: "/admin/statistics",
    icon: BarChart3,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8 mt-4">
        <h1 className="text-xl font-bold px-4">Admin Panel</h1>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center py-2 px-4 rounded-md transition-colors",
              pathname === item.href
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 w-52">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isPending) logout();
          }}
          disabled={isPending}
          className="flex items-center py-2 px-4 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white w-full transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>{isPending ? "Đăng xuất..." : "Đăng xuất"}</span>
        </button>
      </div>
    </aside>
  );
}
