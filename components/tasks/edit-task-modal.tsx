"use client"

import { useState, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Task, useApp } from "@/context/app-context"
import { HiOutlineX, HiOutlineCheck } from "react-icons/hi"

interface EditTaskModalProps {
  isOpen: boolean
  task: Task
  onClose: () => void
}

const categories = ["کاری", "شخصی", "یادگیری", "سلامت", "خرید", "سایر"]
const priorities = ["high", "medium", "low"] as const
const priorityLabels = { high: "بالا", medium: "متوسط", low: "پایین" }

export function EditTaskModal({ isOpen, task, onClose }: EditTaskModalProps) {
  const { updateTask, addNotification } = useApp()
  const [formData, setFormData] = useState(task)

  useEffect(() => {
    setFormData(task)
  }, [task, isOpen])

  const handleSave = (e?: FormEvent) => {
    e?.preventDefault()
    if (!formData.title.trim()) {
      addNotification("عنوان تسک نمی‌تواند خالی باشد", "error")
      return
    }

    updateTask(task.id, {
      title: formData.title.trim(),
      description: formData.description?.trim(),
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      duration: Number(formData.duration) || 1,
      completed: formData.completed,
      smsReminder: formData.smsReminder,
    })
    addNotification("تسک با موفقیت ویرایش شد", "success")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background glass-card border-l border-border p-6 overflow-y-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">ویرایش تسک</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-card-hover transition-colors"
              >
                <HiOutlineX className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  عنوان تسک
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  توضیحات
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none h-24"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  دسته‌بندی
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  اولویت
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        formData.priority === p
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground-secondary hover:bg-card-hover"
                      }`}
                    >
                      {priorityLabels[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  تاریخ سررسید
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  dir="ltr"
                />
              </div>

              {/* Due Time */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  ساعت سررسید
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  dir="ltr"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  مدت زمان (دقیقه)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  min="1"
                  dir="ltr"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  ذخیره
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground-secondary font-medium"
                >
                  انصراف
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
