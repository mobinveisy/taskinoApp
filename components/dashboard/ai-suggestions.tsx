"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineLightningBolt, HiOutlineSparkles, HiOutlinePlus, HiOutlineCheck } from "react-icons/hi"
import { useApp } from "@/context/app-context"

export function AISuggestions() {
  const { tasks, addTask } = useApp()
  const [addedSuggestions, setAddedSuggestions] = useState<number[]>([])

  // Generate smart suggestions based on user tasks
  const generateSuggestions = () => {
    const suggestions = []
    const incompleteTasks = tasks.filter((t) => !t.completed)
    const highPriorityTasks = incompleteTasks.filter((t) => t.priority === "high")
    
    // Suggestion 1: High priority tasks
    if (highPriorityTasks.length > 0) {
      suggestions.push({
        id: 1,
        title: "تسک‌های اولویت‌دار",
        description: `${highPriorityTasks.length} تسک با اولویت بالا برای امروز دارید که باید زودتر انجام شوند`,
        icon: HiOutlineLightningBolt,
        color: "from-destructive to-red-400",
        action: null,
      })
    }

    // Suggestion 2: Best meeting time based on tasks
    const morningTasks = incompleteTasks.filter((t) => {
      const hour = parseInt(t.dueTime.split(":")[0])
      return hour >= 8 && hour < 12
    })
    
    suggestions.push({
      id: 2,
      title: "بهترین زمان برای جلسه",
      description: morningTasks.length < 2 
        ? "ساعت ۱۰ صبح بهترین زمان برای جلسات است - برنامه صبح شما خالی است"
        : "ساعت ۱۴ بعدازظهر برای جلسه مناسب‌تر است",
      icon: HiOutlineSparkles,
      color: "from-primary to-violet-400",
      action: null,
    })

    // Suggestion 3: Rest time recommendation
    suggestions.push({
      id: 3,
      title: "پیشنهاد استراحت",
      description: "پیشنهاد می‌کنم بین تسک‌ها یک استراحت ۱۵ دقیقه‌ای داشته باشید",
      icon: HiOutlineLightningBolt,
      color: "from-secondary to-cyan-400",
      action: {
        type: "add_task",
        task: {
          title: "استراحت کوتاه",
          description: "نوشیدن آب و کشش عضلات",
          category: "سلامت",
          priority: "low" as const,
          dueDate: new Date().toISOString().split("T")[0],
          dueTime: "15:00",
          duration: 15,
          completed: false,
        },
      },
    })

    // Suggestion 4: Based on missing categories
    const categories = [...new Set(tasks.map((t) => t.category))]
    if (!categories.includes("ورزش") && !categories.includes("سلامت")) {
      suggestions.push({
        id: 4,
        title: "فعالیت بدنی",
        description: "امروز فعالیت بدنی نداشتید. پیاده‌روی کوتاه چطوره؟",
        icon: HiOutlineSparkles,
        color: "from-green-500 to-emerald-400",
        action: {
          type: "add_task",
          task: {
            title: "پیاده‌روی ۳۰ دقیقه‌ای",
            description: "پیاده‌روی سریع در پارک یا اطراف",
            category: "سلامت",
            priority: "medium" as const,
            dueDate: new Date().toISOString().split("T")[0],
            dueTime: "18:00",
            duration: 30,
            completed: false,
          },
        },
      })
    }

    return suggestions.slice(0, 4)
  }

  const suggestions = generateSuggestions()

  const handleAddTask = (suggestionId: number, task: Parameters<typeof addTask>[0]) => {
    addTask(task)
    setAddedSuggestions((prev) => [...prev, suggestionId])
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
          <HiOutlineSparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">پیشنهادات هوشمند</h3>
          <p className="text-sm text-foreground-muted">توصیه‌های AI برای بهره‌وری بهتر</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          const isAdded = addedSuggestions.includes(suggestion.id)
          
          return (
            <motion.div
              key={suggestion.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index + 0.5 }}
              whileHover={{ x: -4 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-card-hover transition-all"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${suggestion.color} shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{suggestion.title}</p>
                <p className="text-sm text-foreground-muted mt-1">{suggestion.description}</p>
              </div>
              {suggestion.action && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (!isAdded && suggestion.action) {
                      handleAddTask(suggestion.id, suggestion.action.task)
                    }
                  }}
                  disabled={isAdded}
                  className={`p-2 rounded-lg shrink-0 transition-all ${
                    isAdded
                      ? "bg-green-500/20 text-green-500"
                      : "bg-primary/20 text-primary hover:bg-primary/30"
                  }`}
                >
                  {isAdded ? (
                    <HiOutlineCheck className="w-4 h-4" />
                  ) : (
                    <HiOutlinePlus className="w-4 h-4" />
                  )}
                </motion.button>
              )}
            </motion.div>
          )
        })}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <HiOutlineSparkles className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <p className="text-foreground-muted">هنوز پیشنهادی وجود ندارد</p>
          <p className="text-sm text-foreground-muted mt-1">تسک‌های بیشتری اضافه کنید</p>
        </div>
      )}
    </motion.div>
  )
}
