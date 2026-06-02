"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { TopNav } from "@/components/layout/top-nav"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { TodayTasks } from "@/components/dashboard/today-tasks"
import { AISuggestions } from "@/components/dashboard/ai-suggestions"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { motion } from "framer-motion"
import { useApp } from "@/context/app-context"

export default function DashboardPage() {
  const { user } = useApp()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "صبح بخیر"
    if (hour < 17) return "عصر بخیر"
    return "شب بخیر"
  }

  return (
    <MainLayout>
      <TopNav
        title={`${getGreeting()}، ${user?.name || "کاربر"}`}
        subtitle="امروز چه کارهایی داری؟"
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-4 sm:p-6 bg-gradient-to-l from-primary/20 via-transparent to-accent/20"
        >
          <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2 text-balance">
            به داشبورد مدیریت تسک خوش آمدید
          </h2>
          <p className="text-sm sm:text-base text-foreground-muted">
            با استفاده از ابزارهای هوشمند، کارهای روزانه خود را بهتر مدیریت کنید
          </p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Chart & Tasks */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <WeeklyChart />
            <TodayTasks />
          </div>

          {/* Right Column - AI & Calendar */}
          <div className="space-y-4 sm:space-y-6">
            <AISuggestions />
            <CalendarWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
