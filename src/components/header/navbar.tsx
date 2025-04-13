"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mainNavItems } from "@/lib/constants/navigation";
import { ChevronDownIcon } from "lucide-react";

interface NavItemProps {
  title: string;
  href: string;
  dropdownItems?: Array<{ title: string; href: string }>;
}

const NavItem = ({ title, href, dropdownItems }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!dropdownItems) {
    return (
      <Link
        href={href}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
      >
        {title}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDownIcon className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <div className="absolute left-0 mt-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                {dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Navbar() {
  return (
    <nav className="hidden lg:flex items-center gap-2">
      {mainNavItems.map((item) => (
        <NavItem
          key={item.href}
          title={item.title}
          href={item.href}
          dropdownItems={item.dropdownItems}
        />
      ))}
    </nav>
  );
}
