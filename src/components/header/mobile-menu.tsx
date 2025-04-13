"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNavItems } from "@/lib/constants/navigation";
import { MenuIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavItemProps {
  title: string;
  href: string;
  dropdownItems?: Array<{ title: string; href: string }>;
  onClose: () => void;
}

const MobileNavItem = ({
  title,
  href,
  dropdownItems,
  onClose,
}: MobileNavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!dropdownItems) {
    return (
      <Link
        href={href}
        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={onClose}
      >
        {title}
      </Link>
    );
  }

  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="overflow-hidden bg-gray-50 dark:bg-gray-900">
          <div className="py-1">
            {dropdownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-8 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden relative">
          {open ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] p-0 pt-10">
        <nav className="py-2">
          {mainNavItems.map((item) => (
            <MobileNavItem
              key={item.href}
              {...item}
              onClose={() => setOpen(false)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
