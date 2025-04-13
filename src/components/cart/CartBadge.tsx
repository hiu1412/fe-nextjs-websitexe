"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  variant?: "default" | "outline" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CartBadge({
  variant = "outline",
  size = "icon",
  className,
}: CartBadgeProps) {
  const { totalItems } = useCart();
  const router = useRouter();

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative", className)}
      onClick={() => router.push("/cart")}
      aria-label="Giỏ hàng"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </Button>
  );
}
