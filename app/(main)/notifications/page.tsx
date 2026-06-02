"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { TopNav } from "@/components/layout/top-nav"
import { useApp } from "@/context/app-context"
import { HiOutlineBell, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationCircle } from "react-icons/hi"

function toPersianNumber(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
}

function getPersianDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export default function NotificationsPage() {
  const { tasks, smsSettings } = useApp()

  const today = new Date().toISOString().split("T")[0]
  const pendingTasks = tasks.filter((task) => !task.completed)
  const todayTasks = pendingTasks.filter((task) => task.dueDate === today)
  const overdueTasks = pendingTasks.filter((task) => task.dueDate < today)
  const smsTasks = pendingTasks.filter((task) => task.smsReminder)

  const items = [
    ...overdueTasks.map((task) => ({
      id: `overdue-${task.id}`,
      title: `تسک عقب‌افتاده: ${task.title}`,
      description: `موعد انجام: ${getPersianDate(task.dueDate)} ساعت ${task.dueTime}`,
      icon: HiOutlineExclamationCircle,
      tone: "text-destructive bg-destructive/10 border-destructive/30",
    })),
    ...todayTasks.map((task) => ({
      id: `today-${task.id}`,
      title: `تسک امروز: ${task.title}`,
      description: `زمان انجام: ساعت ${task.dueTime}، مدت ${toPersianNumber(task.duration)} دقیقه`,
      icon: HiOutlineCalendar,
      tone: "text-primary bg-primary/10 border-primary/30",
    })),
    ...smsTasks.map((task) => ({
      id: `sms-${task.id}`,
      title: `یادآوری پیامکی برای ${task.title}`,
      description: smsSettings.enabled
        ? `یادآوری ${toPersianNumber(smsSettings.reminderMinutes)} دقیقه قبل از تسک فعال است`
        : "برای ارسال پیامک، یادآوری پیامکی را از تنظیمات فعال کنید",
      icon: HiOutlineClock,
      tone: "text-accent bg-accent/10 border-accent/30",
    })),
  ]

  return (
    <MainLayout>
      <TopNav title="اعلان‌ها" subtitle="مرکز اعلان‌ها و یادآوری‌های تسک‌ها" />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-20 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-2xl font-bold text-foreground">{toPersianNumber(todayTasks.length)}</p>
            <p className="text-sm text-foreground-muted mt-1">تسک امروز</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-2xl font-bold text-destructive">{toPersianNumber(overdueTasks.length)}</p>
            <p className="text-sm text-foreground-muted mt-1">عقب‌افتاده</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-2xl font-bold text-accent">{toPersianNumber(smsTasks.length)}</p>
            <p className="text-sm text-foreground-muted mt-1">دارای یادآوری</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <HiOutlineBell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">اعلان‌های فعال</h2>
              <p className="text-sm text-foreground-muted">بر اساس تسک‌های ثبت‌شده شما</p>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`flex items-start gap-3 rounded-2xl border p-4 ${item.tone}`}
                  >
                    <Icon className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="text-sm text-foreground-muted mt-1">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <HiOutlineCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-foreground">اعلان فعالی وجود ندارد</h3>
              <p className="text-sm text-foreground-muted mt-1">تسک‌های امروز، عقب‌افتاده و یادآوری‌ها اینجا نمایش داده می‌شوند.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
