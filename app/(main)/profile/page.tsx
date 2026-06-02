"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { TopNav } from "@/components/layout/top-nav"
import { useApp } from "@/context/app-context"
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineCamera,
} from "react-icons/hi"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function ProfilePage() {
  const { user, tasks, updateUser, addNotification } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync form data when user changes (e.g., loaded from localStorage)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  // Task statistics
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = tasks.filter((t) => !t.completed).length
  const totalTasks = tasks.length

  const pieData = [
    { name: "تکمیل شده", value: completedTasks, color: "#10B981" },
    { name: "در انتظار", value: pendingTasks, color: "#8B5CF6" },
  ]

  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    })
    addNotification("پروفایل ذخیره شد", "success")
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
    setIsEditing(false)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      addNotification("لطفاً یک فایل عکس انتخاب کنید", "error")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      updateUser({ avatar: String(reader.result) })
      addNotification("عکس پروفایل اعمال شد", "success")
    }
    reader.onerror = () => addNotification("خطا در خواندن عکس", "error")
    reader.readAsDataURL(file)
  }

  return (
    <MainLayout>
      <TopNav title="پروفایل کاربری" subtitle="مدیریت اطلاعات شخصی" />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-20">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="عکس پروفایل" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-2xl sm:text-4xl">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -left-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-background border border-border hover:bg-card-hover transition-colors"
                title="تغییر عکس پروفایل"
              >
                <HiOutlineCamera className="w-3 h-3 sm:w-4 sm:h-4 text-foreground-muted" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center w-full">
              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <HiOutlineUser className="w-5 h-5 text-foreground-muted shrink-0" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <HiOutlineMail className="w-5 h-5 text-foreground-muted shrink-0" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <HiOutlinePhone className="w-5 h-5 text-foreground-muted shrink-0" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-primary text-white font-medium text-sm sm:text-base"
                    >
                      <HiOutlineCheck className="w-4 h-4" />
                      ذخیره
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-muted text-foreground-secondary font-medium text-sm sm:text-base"
                    >
                      <HiOutlineX className="w-4 h-4" />
                      انصراف
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{user?.name}</h2>
                  <div className="flex flex-col items-center gap-1 sm:gap-2 mt-2 text-foreground-muted text-sm">
                    <span className="flex items-center gap-1">
                      <HiOutlineMail className="w-4 h-4" />
                      {user?.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlinePhone className="w-4 h-4" />
                      {user?.phone}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-muted text-foreground-secondary font-medium text-sm hover:bg-card-hover transition-all mx-auto"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                    ویرایش پروفایل
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Task Overview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">خلاصه تسک‌ها</h3>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#F9FAFB",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 sm:space-y-3 text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                  <span className="text-foreground-secondary">تکمیل شده: {completedTasks}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary" />
                  <span className="text-foreground-secondary">در انتظار: {pendingTasks}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <span className="text-foreground font-bold">مجموع: {totalTasks} تسک</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">تسک‌ها بر اساس دسته‌بندی</h3>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(categoryStats).map(([category, count], index) => (
                <div key={category} className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="text-foreground-secondary flex-1 truncate">{category}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalTasks) * 100}%` }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <span className="text-foreground font-bold w-6 sm:w-8 text-center">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">فعالیت اخیر</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "تسک‌های این هفته", value: "۱۲", change: "+۳" },
              { label: "درصد تکمیل", value: `${Math.round((completedTasks / totalTasks) * 100)}%`, change: "+۵%" },
              { label: "متوسط زمان", value: "۴۵ دقیقه", change: "-۱۰" },
              { label: "امتیاز بهره‌وری", value: "۸۵", change: "+۲" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50 text-center"
              >
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-foreground-muted mt-1 truncate">{stat.label}</p>
                <p className="text-xs text-green-400 mt-1">{stat.change}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
