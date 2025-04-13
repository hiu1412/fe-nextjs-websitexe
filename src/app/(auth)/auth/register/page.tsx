"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRegister } from "@/hooks/auth/use-register";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";
import { useState } from "react";
import { VerifyEmailModal } from "@/components/auth/verify-email-modal";

export default function RegisterPage() {
  const {
    mutate: register,
    isPending,
    showVerifyModal,
    setShowVerifyModal,
    registeredEmail,
  } = useRegister();
  const { verify, resend, isVerifying, isResending, error } = useVerifyEmail();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "name" ? "full_name" : id]: value,
    }));
  };

  const handleGoogleRegister = async () => {
    // ... existing code ...
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Tạo tài khoản mới
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tham gia cùng chúng tôi ngay hôm nay
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Họ tên
            </label>
            <input
              type="text"
              id="name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Tôi đồng ý với{" "}
              <Link href="#" className="text-primary hover:underline">
                điều khoản
              </Link>{" "}
              và{" "}
              <Link href="#" className="text-primary hover:underline">
                chính sách bảo mật
              </Link>
            </label>
          </div>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-white rounded-md py-2.5 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </motion.div>
        </form>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
            Hoặc đăng ký bằng
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md py-2.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
      <VerifyEmailModal
        email={registeredEmail}
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerify={(token) => verify(registeredEmail, token)}
        onResend={() => resend(registeredEmail)}
        isLoading={isVerifying || isResending}
        error={error}
      />
    </div>
  );
}
