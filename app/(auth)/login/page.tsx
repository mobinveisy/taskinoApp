"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineInformationCircle,
} from "react-icons/hi"
import { useApp } from "@/context/app-context"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTestInfo, setShowTestInfo] = useState(true)
  const { login, signup } = useApp()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (isLogin) {
      const success = login(formData.email, formData.password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("ایمیل یا رمز عبور اشتباه است")
        setIsLoading(false)
      }
    } else {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError("لطفا تمام فیلدها را پر کنید")
        setIsLoading(false)
        return
      }
      
      const success = signup(formData.name, formData.email, formData.phone, formData.password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("این ایمیل یا شماره تلفن قبلا ثبت شده است")
        setIsLoading(false)
      }
    }
  }

  const fillTestAccount = () => {
    setFormData({
      ...formData,
      email: "test@test.com",
      password: "2404",
    })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-3 sm:p-4">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="gradient-blob w-64 sm:w-96 h-64 sm:h-96 bg-primary/40 -top-20 -right-20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="gradient-blob w-56 sm:w-80 h-56 sm:h-80 bg-secondary/30 bottom-20 -left-20"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="gradient-blob w-48 sm:w-64 h-48 sm:h-64 bg-accent/20 top-1/3 left-1/4"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Login/Signup Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary mb-3 sm:mb-4">
              <span className="text-white font-bold text-xl sm:text-2xl">T</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">تسک منیجر</h1>
            <p className="text-foreground-muted text-sm mt-1">
              مدیریت هوشمند کارهای روزانه
            </p>
          </motion.div>

          {/* Test Account Info */}
          <AnimatePresence>
            {showTestInfo && isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 relative">
                  <button
                    type="button"
                    onClick={() => setShowTestInfo(false)}
                    className="absolute top-2 left-2 text-foreground-muted hover:text-foreground"
                  >
                    <HiOutlineInformationCircle className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3">
                    <HiOutlineInformationCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-2">حساب تست آماده:</p>
                      <div className="space-y-1 text-foreground-muted">
                        <p>ایمیل: <span className="font-mono text-foreground">test@test.com</span></p>
                        <p>رمز عبور: <span className="font-mono text-foreground">2404</span></p>
                      </div>
                      <button
                        type="button"
                        onClick={fillTestAccount}
                        className="mt-3 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        پر کردن خودکار
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin ? "bg-card text-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? "bg-card text-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="نام خود را وارد کنید"
                      className="w-full pr-10 sm:pr-12 pl-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                ایمیل یا شماره تلفن
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ایمیل یا شماره تلفن خود را وارد کنید"
                  className="w-full pr-10 sm:pr-12 pl-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09123456789"
                      className="w-full pr-10 sm:pr-12 pl-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                      dir="ltr"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full pr-10 sm:pr-12 pl-10 sm:pl-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-destructive text-sm text-center bg-destructive/10 py-3 px-4 rounded-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-base sm:text-lg hover:opacity-90 transition-all glow-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : isLogin ? (
                "ورود به حساب"
              ) : (
                "ثبت‌نام"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-foreground-muted text-sm mt-6"
          >
            {isLogin ? "حساب ندارید؟ " : "قبلا ثبت‌نام کردید؟ "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {isLogin ? "ثبت‌نام کنید" : "وارد شوید"}
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
