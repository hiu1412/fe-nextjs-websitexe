"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-4 top-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.5 }}
          className="w-72 h-72 bg-primary rounded-full blur-3xl"
        />
      </div>
      <div className="absolute right-4 bottom-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-72 h-72 bg-primary rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-md p-8 relative">
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl">
          <div className="p-8">
            {/* Brand */}
            <div className="text-center mb-8">
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.05,
                  backgroundImage:
                    "linear-gradient(to right, var(--primary), var(--primary), var(--primary))",
                }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                ECOMMERCE
              </motion.h1>
              <motion.div
                className="h-1 w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 80 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
