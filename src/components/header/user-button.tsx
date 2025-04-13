"use client";

import React from "react";
import { User } from "@/lib/api/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { userNavItems, adminNavItems } from "@/lib/constants/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserButtonProps {
  user: User | null;
  onLogout: () => void;
}

export function UserButton({ user, onLogout }: UserButtonProps) {
  if (!user) return null;

  const navItems = user.role === "admin" ? adminNavItems : userNavItems;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center text-sm font-medium">
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="hidden sm:inline max-w-[100px] truncate">
            {user.full_name}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.full_name}
          <p className="text-xs font-normal text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        {navItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              {item.icon && (
                <span className="text-gray-500 dark:text-gray-400">
                  {React.createElement(item.icon, { size: 16 })}
                </span>
              )}
              <span>{item.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
