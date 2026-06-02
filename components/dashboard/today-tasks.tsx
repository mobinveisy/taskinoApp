"use client"

import { motion } from "framer-motion"
import { HiOutlineCheck, HiOutlineClock } from "react-icons/hi"
import { useApp } from "@/context/app-context"

const priorityColors = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
}

const priorityLabels = {
  high: "بالا",
  medium: "متوسط",
  low: "پایین",
}

export function TodayTasks() {
  const { tasks, toggleTaskComplete } = useApp()
  
  const today = new Date().toISOString().split("T")[0]
  const todayTasks = tasks
    .filter((t) => t.dueDate === today || t.dueDate <= today)
    .slice(0, 5)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">تسک‌های امروز</h3>
          <p className="text-sm text-foreground-muted">کارهایی که باید انجام دهید</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
          {todayTasks.length} تسک
        </span>
      </div>

      <div className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-foreground-muted">
            <p>هیچ تسکی برای امروز وجود ندارد</p>
          </div>
        ) : (
          todayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/50 hover:bg-card-hover transition-all cursor-pointer group ${
                task.completed ? "opacity-60" : ""
              }`}
              onClick={() => toggleTaskComplete(task.id)}
            >
              <button
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-primary border-primary"
                    : "border-foreground-muted group-hover:border-primary"
                }`}
              >
                {task.completed && <HiOutlineCheck className="w-4 h-4 text-white" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-foreground truncate ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-foreground-muted">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  <span>{task.dueTime}</span>
                  <span className="text-foreground-muted/50">|</span>
                  <span>{task.duration} دقیقه</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  priorityColors[task.priority]
                }`}
              >
                {priorityLabels[task.priority]}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
