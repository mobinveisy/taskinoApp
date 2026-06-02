"use client"

import { motion } from "framer-motion"
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineChartBar, HiOutlineFire } from "react-icons/hi"
import { useApp } from "@/context/app-context"

export function StatsCards() {
  const { tasks } = useApp()
  
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = tasks.filter((t) => !t.completed).length
  const highPriorityTasks = tasks.filter((t) => t.priority === "high" && !t.completed).length
  const todayTasks = tasks.filter((t) => {
    const today = new Date().toISOString().split("T")[0]
    return t.dueDate === today
  }).length

  const stats = [
    {
      label: "تکمیل شده",
      value: completedTasks,
      icon: HiOutlineCheckCircle,
      color: "from-green-500 to-emerald-500",
      glowColor: "shadow-green-500/30",
    },
    {
      label: "در انتظار",
      value: pendingTasks,
      icon: HiOutlineClock,
      color: "from-secondary to-cyan-400",
      glowColor: "shadow-cyan-500/30",
    },
    {
      label: "اولویت بالا",
      value: highPriorityTasks,
      icon: HiOutlineFire,
      color: "from-accent to-pink-400",
      glowColor: "shadow-pink-500/30",
    },
    {
      label: "تسک امروز",
      value: todayTasks,
      icon: HiOutlineChartBar,
      color: "from-primary to-violet-400",
      glowColor: "shadow-violet-500/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-card glass-card-hover rounded-xl sm:rounded-2xl p-3 sm:p-5 cursor-pointer transition-all duration-300 hover:${stat.glowColor} hover:shadow-lg`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="order-2 sm:order-1">
                <p className="text-foreground-muted text-xs sm:text-sm mb-0.5 sm:mb-1">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`order-1 sm:order-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} w-fit`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
