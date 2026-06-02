"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineX, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi"
import { useApp, Task } from "@/context/app-context"
import { PersianCalendar } from "@/components/ui/persian-calendar"
import { TimePicker } from "@/components/ui/time-picker"

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const categories = ["کاری", "شخصی", "یادگیری", "سلامت", "خرید", "سایر"]
const priorities = [
  { value: "high", label: "بالا", color: "bg-destructive" },
  { value: "medium", label: "متوسط", color: "bg-amber-500" },
  { value: "low", label: "پایین", color: "bg-green-500" },
]

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask } = useApp()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "کاری",
    priority: "medium" as Task["priority"],
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "10:00",
    duration: 30,
  })

  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  // Persian date display helper
  const getPersianDateDisplay = (gregorianDate: string) => {
    const [y, m, d] = gregorianDate.split("-").map(Number)
    const persianMonths = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ]
    // Simple conversion for display
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    let jy = y <= 1600 ? 0 : 979
    const gy = y <= 1600 ? y - 621 : y - 1600
    const gy2 = m > 2 ? gy + 1 : gy
    let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
      Math.floor((gy2 + 399) / 400) - 80 + d + g_d_m[m - 1]
    jy += 33 * Math.floor(days / 12053)
    days %= 12053
    jy += 4 * Math.floor(days / 1461)
    days %= 1461
    if (days > 365) {
      jy += Math.floor((days - 1) / 365)
      days = (days - 1) % 365
    }
    const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30)
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30)
    return `${jd} ${persianMonths[jm - 1]} ${jy}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask({
      ...formData,
      completed: false,
    })
    setFormData({
      title: "",
      description: "",
      category: "کاری",
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "10:00",
      duration: 30,
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">افزودن تسک جدید</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-card-hover transition-colors"
                >
                  <HiOutlineX className="w-5 h-5 text-foreground-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    عنوان تسک
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="عنوان تسک را وارد کنید"
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="توضیحات اختیاری"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    دسته‌بندی
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.category === cat
                            ? "bg-primary text-white"
                            : "bg-muted text-foreground-secondary hover:bg-card-hover"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    اولویت
                  </label>
                  <div className="flex gap-3">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: p.value as Task["priority"] })}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                          formData.priority === p.value
                            ? "border-primary bg-primary/20 text-foreground"
                            : "border-border bg-muted text-foreground-secondary hover:bg-card-hover"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${p.color}`} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-2">
                      تاریخ
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCalendar(!showCalendar)
                        setShowTimePicker(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-input border transition-all text-right ${
                        showCalendar ? "border-primary ring-2 ring-primary/50" : "border-border"
                      }`}
                    >
                      <HiOutlineCalendar className="w-5 h-5 text-primary" />
                      <span className="text-foreground text-sm">
                        {getPersianDateDisplay(formData.dueDate)}
                      </span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-2">
                      ساعت
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTimePicker(!showTimePicker)
                        setShowCalendar(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-input border transition-all text-right ${
                        showTimePicker ? "border-primary ring-2 ring-primary/50" : "border-border"
                      }`}
                    >
                      <HiOutlineClock className="w-5 h-5 text-secondary" />
                      <span className="text-foreground text-sm font-mono">{formData.dueTime}</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Dropdown */}
                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <PersianCalendar
                          selectedDate={formData.dueDate}
                          onSelect={(date) => {
                            setFormData({ ...formData, dueDate: date })
                            setShowCalendar(false)
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Time Picker Dropdown */}
                <AnimatePresence>
                  {showTimePicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <TimePicker
                          value={formData.dueTime}
                          onChange={(time) => setFormData({ ...formData, dueTime: time })}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    مدت زمان تخمینی (دقیقه)
                  </label>
                  <div className="flex gap-2">
                    {[15, 30, 45, 60, 90, 120].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: d })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.duration === d
                            ? "bg-accent text-white"
                            : "bg-muted text-foreground-secondary hover:bg-card-hover"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-border text-foreground-secondary font-medium hover:bg-card-hover transition-all"
                  >
                    انصراف
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:opacity-90 transition-all glow-primary"
                  >
                    افزودن تسک
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
