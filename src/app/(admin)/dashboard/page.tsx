"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Car,
  Building2,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  LogOut,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <Card className="p-6 bg-card text-card-foreground">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp
              className={`w-4 h-4 mr-1 ${
                trend.isUp ? "text-green-500" : "text-red-500"
              }`}
            />
            <span
              className={`text-sm ${
                trend.isUp ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.value}% {trend.isUp ? "tăng" : "giảm"}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
);

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
  });

  const defaultStats = {
    totalCars: 0,
    totalBrands: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
  };

  const {
    totalCars,
    totalBrands,
    totalOrders,
    totalUsers,
    totalRevenue,
    totalProducts,
  } = stats?.data || defaultStats;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tổng quan Admin</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <Card className="bg-card">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Thông tin người dùng</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Tên:</span>{" "}
              {user?.full_name}
            </p>
            <p>
              <span className="font-medium text-foreground">Email:</span>{" "}
              {user?.email}
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-2">Thống kê tổng quan</h2>
        <p className="text-muted-foreground mb-6">
          Chào mừng bạn đến với trang quản trị. Dưới đây là thống kê hiện tại.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Tổng số xe"
            value={totalCars}
            icon={Car}
            trend={{ value: 12, isUp: true }}
          />
          <StatCard
            title="Tổng số hãng xe"
            value={totalBrands}
            icon={Building2}
          />
          <StatCard
            title="Tổng đơn hàng"
            value={totalOrders}
            icon={ShoppingCart}
            trend={{ value: 8, isUp: true }}
          />
          <StatCard title="Tổng người dùng" value={totalUsers} icon={Users} />
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            icon={TrendingUp}
            trend={{ value: 15, isUp: true }}
          />
          <StatCard
            title="Tổng sản phẩm"
            value={totalProducts}
            icon={Package}
          />
        </div>
      </div>
    </div>
  );
}
