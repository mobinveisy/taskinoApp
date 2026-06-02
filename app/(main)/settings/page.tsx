"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { TopNav } from "@/components/layout/top-nav"
import { Switch } from "@/components/ui/switch"
import { useApp } from "@/context/app-context"
import {
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineDownload,
  HiOutlineChat,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi"

interface SettingRowProps {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  icon: React.ElementType
  iconBg?: string
}

function SettingRow({ label, description, checked, onCheckedChange, icon: Icon, iconBg = "bg-primary/20" }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className={`p-2.5 sm:p-3 rounded-xl ${checked ? iconBg : "bg-muted"} transition-colors shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${checked ? "text-primary" : "text-foreground-muted"}`} />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-foreground text-sm sm:text-base">{label}</h4>
          <p className="text-xs sm:text-sm text-foreground-muted mt-0.5 truncate">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0 h-6 w-11 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-accent"
      />
    </div>
  )
}

export default function SettingsPage() {
  const { smsSettings, updateSmsSettings, user, darkMode, setDarkMode, tasks } = useApp()
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
  })

  const [smsForm, setSmsForm] = useState({
    sender: smsSettings.sender || "",
    reminderMinutes: smsSettings.reminderMinutes || 30,
  })

  const [testSmsStatus, setTestSmsStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle")
  const [testMessage, setTestMessage] = useState("")

  // Sync form with context when smsSettings changes
  useEffect(() => {
    setSmsForm({
      sender: smsSettings.sender || "",
      reminderMinutes: smsSettings.reminderMinutes || 30,
    })
  }, [smsSettings.sender, smsSettings.reminderMinutes])

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleDownloadBackup = () => {
    const backupData = {
      user,
      tasks,
      timestamp: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `task-manager-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDeleteData = () => {
    if (window.confirm("آیا مطمئن هستید؟ تمام داده‌ها حذف خواهند شد.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleSmsSettingsSave = () => {
    updateSmsSettings({
      ...smsForm,
      enabled: smsSettings.enabled,
    })
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleTestSms = async () => {
    console.log("[v0] Test SMS button clicked")
    if (!user?.phone) {
      setTestMessage("لطفا شماره تلفن خود را در پروفایل وارد کنید")
      setTestSmsStatus("error")
      setTimeout(() => {
        setTestSmsStatus("idle")
        setTestMessage("")
      }, 3000)
      return
    }

    setTestSmsStatus("loading")
    setTestMessage("")

    try {
      console.log("[v0] Sending SMS test request...")
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receptor: user.phone,
          message: "تست یادآوری تسک منیجر - این پیام تستی است",
        }),
      })

      console.log("[v0] Response status:", response.status)
      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (response.ok && data.success) {
        setTestSmsStatus("success")
        setTestMessage("پیامک با موفقیت ارسال شد")
      } else {
        setTestSmsStatus("error")
        setTestMessage(data.error || "خطا در ارسال پیامک")
      }
    } catch (error) {
      console.error("[v0] Test SMS error:", error)
      setTestSmsStatus("error")
      setTestMessage("خطا در اتصال به سرور")
    }

    setTimeout(() => {
      setTestSmsStatus("idle")
      setTestMessage("")
    }, 5000)
  }

  return (
    <MainLayout>
      <TopNav title="تنظیمات" subtitle="مدیریت حساب و ترجیحات" />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-24">
        {/* Notifications Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <HiOutlineBell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">اعلان‌ها و یادآوری</h3>
              <p className="text-xs sm:text-sm text-foreground-muted">مدیریت نحوه دریافت اعلان‌ها</p>
            </div>
          </div>
          <div className="space-y-3">
            <SettingRow
              label="اعلان‌های برنامه"
              description="دریافت اعلان برای تسک‌های جدید"
              checked={settings.notifications}
              onCheckedChange={() => toggleSetting("notifications")}
              icon={HiOutlineBell}
            />
          </div>
        </motion.div>

        {/* SMS Settings Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-cyan-400">
                <HiOutlineChat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">یادآوری پیامکی</h3>
                <p className="text-xs sm:text-sm text-foreground-muted">تنظیمات Kavenegar</p>
              </div>
            </div>
            <Switch
              checked={smsSettings.enabled}
              onCheckedChange={(checked) => updateSmsSettings({ enabled: checked })}
              className="h-6 w-11 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-secondary data-[state=checked]:to-cyan-400"
            />
          </div>

          <AnimatePresence>
            {smsSettings.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3 text-xs sm:text-sm text-foreground-secondary leading-6">
                  کلید API از فایل <span className="font-mono" dir="ltr">.env.local</span> خوانده می‌شود و دیگر داخل مرورگر نمایش داده نمی‌شود.
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground-secondary mb-2">
                    <HiOutlinePhone className="w-4 h-4" />
                    شماره فرستنده
                  </label>
                  <input
                    type="text"
                    value={smsForm.sender}
                    onChange={(e) => setSmsForm({ ...smsForm, sender: e.target.value })}
                    placeholder="10008663"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-mono text-sm"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground-secondary mb-2">
                    <HiOutlineClock className="w-4 h-4" />
                    زمان یادآوری (دقیقه قبل از تسک)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 60, 120].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setSmsForm({ ...smsForm, reminderMinutes: mins })}
                        className={`py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          smsForm.reminderMinutes === mins
                            ? "bg-secondary text-white"
                            : "bg-muted text-foreground-secondary hover:bg-card-hover"
                        }`}
                      >
                        {mins} دقیقه
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSmsSettingsSave}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-secondary to-cyan-500 text-white font-medium text-sm sm:text-base"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    {saveStatus === "saved" ? "ذخیره شد" : "ذخیره تنظیمات"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTestSms}
                    disabled={testSmsStatus === "loading"}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl border border-secondary text-secondary font-medium text-sm sm:text-base hover:bg-secondary/10 transition-all disabled:opacity-50"
                  >
                    {testSmsStatus === "loading" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full"
                      />
                    ) : testSmsStatus === "success" ? (
                      <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                    ) : testSmsStatus === "error" ? (
                      <HiOutlineExclamationCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <HiOutlineChat className="w-5 h-5" />
                    )}
                    ارسال تست
                  </motion.button>
                </div>

                {testMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-sm text-center ${
                      testSmsStatus === "success"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-destructive/20 text-destructive border border-destructive/30"
                    }`}
                  >
                    {testMessage}
                  </motion.div>
                )}

                {user?.phone && (
                  <div className="p-3 rounded-xl bg-muted/50 text-sm text-foreground-muted text-center">
                    پیامک تست به شماره <span className="font-mono text-foreground">{user.phone}</span> ارسال می‌شود
                  </div>
                )}

                <div className="p-3 sm:p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <p className="text-xs sm:text-sm text-foreground-muted">
                    برای استفاده از سرویس پیامک، به{" "}
                    <a
                      href="https://kavenegar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      kavenegar.com
                    </a>{" "}
                    مراجعه کرده و کلید API دریافت کنید.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-pink-400">
              <HiOutlineMoon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">ظاهر برنامه</h3>
              <p className="text-xs sm:text-sm text-foreground-muted">شخصی‌سازی نمای برنامه</p>
            </div>
          </div>
          <div className="space-y-3">
            <SettingRow
              label="حالت شب"
              description="استفاده از تم تیره برای برنامه"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              icon={HiOutlineMoon}
              iconBg="bg-accent/20"
            />
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400">
              <HiOutlineShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">امنیت و پشتیبان‌گیری</h3>
              <p className="text-xs sm:text-sm text-foreground-muted">مدیریت داده‌ها و امنیت</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <SettingRow
              label="پشتیبان‌گیری خودکار"
              description="ذخیره خودکار داده‌ها در حافظه"
              checked={settings.autoBackup}
              onCheckedChange={() => toggleSetting("autoBackup")}
              icon={HiOutlineShieldCheck}
              iconBg="bg-green-500/20"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 sm:pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadBackup}
                className="flex items-center justify-center gap-3 px-4 py-3 sm:py-4 rounded-2xl bg-card/50 border border-border hover:border-secondary/50 text-foreground font-medium transition-all text-sm sm:text-base"
              >
                <HiOutlineDownload className="w-5 h-5 text-secondary" />
                دانلود پشتیبان
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteData}
                className="flex items-center justify-center gap-3 px-4 py-3 sm:py-4 rounded-2xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 text-destructive font-medium transition-all text-sm sm:text-base"
              >
                <HiOutlineTrash className="w-5 h-5" />
                پاک کردن داده‌ها
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mx-auto mb-4 glow-primary">
            <span className="text-white font-bold text-2xl sm:text-3xl">T</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">تسک منیجر</h3>
          <p className="text-foreground-muted text-sm mt-1">نسخه ۱.۰.۰</p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-foreground-muted text-xs">
              ساخته شده با عشق برای بهره‌وری بیشتر
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
