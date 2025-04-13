import { AdminProtected } from "./AdminProtected";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProtected>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </AdminProtected>
  );
}
