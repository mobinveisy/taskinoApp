"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { HiOutlineArrowLeft, HiOutlineSparkles, HiOutlineCheck } from "react-icons/hi"
import { AppProvider } from "@/context/app-context"

const features = [
  "مدیریت تسک‌ها با رابط کاربری زیبا",
  "برنامه‌ریزی هوشمند با AI",
  "یادآوری پیامکی",
  "نمودارهای پیشرفت",
  "تقویم کاری",
  "دسته‌بندی و اولویت‌بندی",
]

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (isAuth === "true") {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="gradient-blob w-96 h-96 bg-primary/40 top-20 right-20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="gradient-blob w-80 h-80 bg-secondary/30 bottom-40 left-40"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="gradient-blob w-64 h-64 bg-accent/20 top-1/2 right-1/3"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="glass-card border-t-0 border-r-0 border-l-0 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-foreground text-xl">تسک منیجر</span>
            </motion.div>
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-all"
            >
              ورود به حساب
              <HiOutlineArrowLeft className="w-4 h-4" />
            </motion.button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                <HiOutlineSparkles className="w-4 h-4" />
                مجهز به هوش مصنوعی
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
                مدیریت هوشمند کارهای روزانه
              </h1>
              <p className="text-xl text-foreground-muted mb-8 text-balance">
                با تسک منیجر، کارهای روزانه خود را به صورت حرفه‌ای مدیریت کنید و بهره‌وری خود را افزایش دهید.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-2 text-foreground-secondary"
                  >
                    <HiOutlineCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/login")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2"
                >
                  شروع رایگان
                  <HiOutlineArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl glass-card text-foreground font-bold text-lg hover:bg-card-hover transition-all"
                >
                  مشاهده دمو
                </motion.button>
              </div>
            </motion.div>

            {/* Visual Card */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card rounded-3xl p-6 lg:p-8">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-24 bg-foreground/20 rounded" />
                      <div className="h-2 w-16 bg-foreground/10 rounded mt-2" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 rounded-xl bg-muted/50">
                        <div className="h-6 w-8 bg-foreground/20 rounded mb-2" />
                        <div className="h-2 w-full bg-foreground/10 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Task List */}
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`p-3 rounded-xl border border-border bg-muted/30 flex items-center gap-3 ${
                          i === 2 ? "opacity-50" : ""
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 ${
                          i === 2 ? "bg-primary border-primary" : "border-foreground/30"
                        }`} />
                        <div className="flex-1">
                          <div className={`h-2 w-3/4 rounded ${i === 2 ? "bg-foreground/10" : "bg-foreground/20"}`} />
                        </div>
                        <div className="h-2 w-12 bg-primary/30 rounded" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 p-3 rounded-xl glass-card shadow-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-foreground">۳ تسک تکمیل شد</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 p-3 rounded-xl glass-card shadow-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <HiOutlineSparkles className="w-4 h-4 text-accent" />
                  <span className="text-foreground">پیشنهاد AI</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="glass-card border-b-0 border-r-0 border-l-0 px-6 py-4">
          <div className="max-w-6xl mx-auto text-center text-foreground-muted text-sm">
            ساخته شده با عشق برای بهره‌وری بیشتر
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  )
}
