"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import AuthCheckProvider from "./auth-check-provider";
import { CartProvider } from "./cart-provider";

export default function RootProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút
            gcTime: 10 * 60 * 1000, // 10 phút
            retry: false, // Không tự động retry khi lỗi
            refetchOnWindowFocus: false, // Không fetch lại khi focus vào cửa sổ
            refetchOnMount: false, // Không fetch lại khi mount component
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <AuthCheckProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </CartProvider>
        </AuthCheckProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
