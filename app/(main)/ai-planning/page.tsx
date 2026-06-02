"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { TopNav } from "@/components/layout/top-nav"
import {
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineChat,
  HiOutlineCheckCircle,
} from "react-icons/hi"
import { useApp } from "@/context/app-context"
import Link from "next/link"

const typeColors = {
  routine: "bg-foreground-muted/20 border-foreground-muted/30",
  meeting: "bg-primary/20 border-primary/30",
  break: "bg-green-500/20 border-green-500/30",
  work: "bg-secondary/20 border-secondary/30",
  learning: "bg-accent/20 border-accent/30",
}

export default function AIPlanningPage() {
  const { tasks, smsSettings, user } = useApp()
  const [isGenerating, setIsGenerating] = useState(false)
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([])

  const pendingTasks = tasks.filter((t) => !t.completed)
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high")
  const todayTasks = pendingTasks.filter((t) => t.dueDate === new Date().toISOString().split("T")[0])

  // Generate dynamic AI suggestions based on actual tasks
  const generateAiSuggestions = () => {
    const suggestions = []
    
    // Suggestion based on high priority tasks
    if (highPriorityTasks.length > 0) {
      suggestions.push({
        id: 1,
        title: "ترتیب اولویت‌بندی جدید",
        description: `شما ${highPriorityTasks.length} تسک با اولویت بالا دارید. پیشنهاد می‌کنم ابتدا این موارد را انجام دهید.`,
        icon: HiOutlineLightningBolt,
        type: "priority",
      })
    }

    // Suggestion based on task distribution
    const morningTasks = todayTasks.filter((t) => {
      const hour = parseInt(t.dueTime.split(":")[0])
      return hour >= 6 && hour < 12
    })
    
    suggestions.push({
      id: 2,
      title: "بهینه‌سازی زمان کاری",
      description: morningTasks.length > 3 
        ? "صبح شما پر است. برخی تسک‌ها را به بعدازظهر منتقل کنید."
        : "بر اساس الگوی کار شما، بهترین ساعات برای تسک‌های مهم بین ۹ تا ۱۲ صبح است.",
      icon: HiOutlineClock,
      type: "productivity",
    })

    // Rest suggestion
    const totalDuration = todayTasks.reduce((sum, t) => sum + t.duration, 0)
    suggestions.push({
      id: 3,
      title: "زمان استراحت پیشنهادی",
      description: totalDuration > 300 
        ? `با ${Math.round(totalDuration / 60)} ساعت کار امروز، حداقل ۲ استراحت ۱۵ دقیقه‌ای داشته باشید.`
        : "یک استراحت ۲۰ دقیقه‌ای در ساعت ۱۵ برای بهره‌وری بیشتر توصیه می‌شود.",
      icon: HiOutlineRefresh,
      type: "health",
    })

    // Category based suggestion
    const categories = [...new Set(tasks.map((t) => t.category))]
    if (!categories.includes("سلامت") && !categories.includes("ورزش")) {
      suggestions.push({
        id: 4,
        title: "فعالیت بدنی فراموش نشود",
        description: "این هفته فعالیت بدنی نداشتید. یک پیاده‌روی ۳۰ دقیقه‌ای چطوره؟",
        icon: HiOutlineSparkles,
        type: "health",
      })
    }

    return suggestions
  }

  const aiSuggestions = generateAiSuggestions()

  // Generate schedule based on actual tasks
  const generateSchedule = () => {
    const schedule = [
      { time: "۰۸:۰۰ - ۰۹:۰۰", task: "بررسی ایمیل‌ها و پیام‌ها", type: "routine" },
    ]

    // Add actual tasks to schedule
    todayTasks
      .sort((a, b) => a.dueTime.localeCompare(b.dueTime))
      .forEach((task) => {
        const [hour, minute] = task.dueTime.split(":").map(Number)
        const endHour = hour + Math.floor((minute + task.duration) / 60)
        const endMinute = (minute + task.duration) % 60
        
        const toPersianTime = (h: number, m: number) => {
          const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
          const convert = (num: number) => String(num).padStart(2, "0").split("").map(d => persianDigits[parseInt(d)]).join("")
          return `${convert(h)}:${convert(m)}`
        }

        schedule.push({
          time: `${toPersianTime(hour, minute)} - ${toPersianTime(endHour, endMinute)}`,
          task: task.title,
          type: task.category === "کاری" ? "work" : task.category === "یادگیری" ? "learning" : task.priority === "high" ? "meeting" : "routine",
        })
      })

    // Add break if schedule is heavy
    if (schedule.length > 3) {
      schedule.splice(3, 0, { time: "۱۲:۳۰ - ۱۳:۳۰", task: "ناهار و استراحت", type: "break" })
    }

    return schedule.slice(0, 8)
  }

  const scheduleBlocks = generateSchedule()

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const handleApplySuggestion = (id: number) => {
    setAppliedSuggestions((prev) => [...prev, id])
  }

  return (
    <MainLayout>
      <TopNav
        title="برنامه‌ریزی هوشمند"
        subtitle="AI برنامه روزانه شما را بهینه می‌کند"
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-24">
        {/* AI Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-l from-primary/20 via-transparent to-secondary/20"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary shrink-0">
                <HiOutlineSparkles className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 text-balance">
                  دستیار هوشمند برنامه‌ریزی
                </h2>
                <p className="text-sm text-foreground-muted text-balance">
                  شما <span className="text-primary font-bold">{pendingTasks.length}</span> تسک در انتظار و{" "}
                  <span className="text-secondary font-bold">{todayTasks.length}</span> تسک برای امروز دارید.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm sm:text-base hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <HiOutlineRefresh className="w-5 h-5" />
              )}
              {isGenerating ? "در حال تحلیل..." : "تولید برنامه جدید"}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* AI Suggestions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <HiOutlineLightningBolt className="w-5 h-5 text-primary" />
              پیشنهادات هوشمند
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {aiSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon
                const isApplied = appliedSuggestions.includes(suggestion.id)
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                      isApplied ? "bg-primary/10 border-primary/30" : "border-border bg-card/50 hover:bg-card-hover"
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${
                        isApplied ? "bg-primary" : "bg-gradient-to-br from-primary to-secondary"
                      }`}>
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm sm:text-base">{suggestion.title}</h4>
                        <p className="text-xs sm:text-sm text-foreground-muted mt-1">{suggestion.description}</p>
                      </div>
                      <button
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        disabled={isApplied}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                          isApplied
                            ? "bg-primary text-white cursor-default"
                            : "bg-muted text-foreground-secondary hover:bg-primary hover:text-white"
                        }`}
                      >
                        {isApplied ? (
                          <span className="flex items-center gap-1">
                            <HiOutlineCheck className="w-4 h-4" />
                            اعمال شد
                          </span>
                        ) : (
                          "اعمال"
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Daily Schedule */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <HiOutlineCalendar className="w-5 h-5 text-secondary" />
              برنامه پیشنهادی امروز
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {scheduleBlocks.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-foreground-muted">
                  <HiOutlineCalendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">هنوز برنامه‌ای تنظیم نشده</p>
                </div>
              ) : (
                scheduleBlocks.map((block, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${typeColors[block.type as keyof typeof typeColors]}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground text-sm sm:text-base truncate">{block.task}</span>
                      <span className="text-xs sm:text-sm text-foreground-muted font-mono shrink-0">{block.time}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* SMS Reminder Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary to-cyan-400 shrink-0">
                <HiOutlineChat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">یادآوری پیامکی</h3>
                <p className="text-xs sm:text-sm text-foreground-muted">
                  {smsSettings.enabled ? (
                    <span className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <HiOutlineCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                      یادآوری فعال - {smsSettings.reminderMinutes} دقیقه قبل
                    </span>
                  ) : (
                    "قبل از هر تسک پیامک یادآوری دریافت کنید."
                  )}
                </p>
              </div>
            </div>
            <Link href="/settings" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                  smsSettings.enabled
                    ? "bg-card border border-secondary text-secondary hover:bg-secondary/10"
                    : "bg-gradient-to-r from-secondary to-cyan-400 text-white hover:opacity-90 glow-secondary"
                }`}
              >
                <HiOutlineChat className="w-5 h-5" />
                {smsSettings.enabled ? "تنظیمات پیامک" : "فعال‌سازی"}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
