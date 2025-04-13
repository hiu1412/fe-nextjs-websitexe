"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerifyEmailModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  error?: string;
}

export function VerifyEmailModal({
  email,
  isOpen,
  onClose,
  onVerify,
  onResend,
  isLoading,
  error
}: VerifyEmailModalProps) {
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(token);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác thực email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vui lòng kiểm tra email <span className="font-medium">{email}</span> và nhập mã xác thực để hoàn tất đăng ký.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nhập mã xác thực"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onResend}
                disabled={isLoading}
              >
                Gửi lại mã
              </Button>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Để sau
                </Button>
                <Button
                  type="submit"
                  disabled={!token || isLoading}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}