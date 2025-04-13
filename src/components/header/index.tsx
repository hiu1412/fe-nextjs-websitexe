"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { useLogout } from "@/hooks/auth/use-logout";
import { ThemeToggle } from "../theme-toggle";
import { Navbar } from "./navbar";
import { MobileMenu } from "./mobile-menu";
import { Button } from "../ui/button";
import { UserButton } from "./user-button";
import { CarIcon, SearchIcon } from "lucide-react";
import { CartBadge } from "../cart/CartBadge";

export function Header() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center space-x-2 pl-2">
            <CarIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">AutoMarket</span>
          </Link>

          {/* Mobile Logo */}
          <Link href="/" className="md:hidden pl-2">
            <CarIcon className="h-6 w-6" />
          </Link>

          {/* Main Navigation */}
          <Navbar />
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <SearchIcon className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <CartBadge variant="ghost" />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Section */}
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
            ) : isAuthenticated ? (
              <UserButton user={user} onLogout={logout.mutate} />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
