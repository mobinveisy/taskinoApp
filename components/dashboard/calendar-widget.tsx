"use client"

import { motion } from "framer-motion"
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi"
import { useMemo, useState } from "react"
import { useApp } from "@/context/app-context"

const persianDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"]
const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
]

function toPersianNumber(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
}

function getJalaliParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })

  const parts = formatter.formatToParts(date)
  const year = Number(parts.find((part) => part.type === "year")?.value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) || 0)
  const month = Number(parts.find((part) => part.type === "month")?.value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) || 1)
  const day = Number(parts.find((part) => part.type === "day")?.value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) || 1)

  return { year, month, day }
}

function getPersianWeekdayIndex(date: Date) {
  // JS: 0 Sunday ... 6 Saturday. Persian calendar starts with Saturday.
  return (date.getDay() + 1) % 7
}

function getDaysInDisplayedJalaliMonth(year: number, month: number) {
  if (month <= 6) return 31
  if (month <= 11) return 30
  // Good enough for display; leap years show 30 for Esfand when browser date says so around year end.
  return 29
}

export function CalendarWidget() {
  const { tasks } = useApp()
  const today = useMemo(() => new Date(), [])
  const todayJalali = getJalaliParts(today)
  const [monthOffset, setMonthOffset] = useState(0)

  const displayedDate = useMemo(() => {
    const date = new Date(today)
    date.setMonth(date.getMonth() + monthOffset)
    return date
  }, [today, monthOffset])

  const displayedJalali = getJalaliParts(displayedDate)
  const monthName = persianMonths[displayedJalali.month - 1]
  const daysInMonth = getDaysInDisplayedJalaliMonth(displayedJalali.year, displayedJalali.month)
  const firstDayApprox = new Date(displayedDate)
  firstDayApprox.setDate(displayedDate.getDate() - displayedJalali.day + 1)
  const firstWeekday = getPersianWeekdayIndex(firstDayApprox)

  const taskDays = new Set(
    tasks
      .map((task) => getJalaliParts(new Date(`${task.dueDate}T${task.dueTime || "00:00"}`)))
      .filter((date) => date.year === displayedJalali.year && date.month === displayedJalali.month)
      .map((date) => date.day)
  )

  const calendarDays = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  const todayLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">تقویم شمسی</h3>
          <p className="text-xs text-foreground-muted mt-1">امروز: {todayLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMonthOffset((offset) => offset - 1)}
            className="p-2 rounded-lg hover:bg-card-hover transition-colors"
            aria-label="ماه قبل"
          >
            <HiOutlineChevronRight className="w-5 h-5 text-foreground-muted" />
          </button>
          <span className="text-foreground font-medium px-2 min-w-32 text-center">
            {monthName} {toPersianNumber(displayedJalali.year)}
          </span>
          <button 
            onClick={() => setMonthOffset((offset) => offset + 1)}
            className="p-2 rounded-lg hover:bg-card-hover transition-colors"
            aria-label="ماه بعد"
          >
            <HiOutlineChevronLeft className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {persianDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-foreground-muted py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isToday = monthOffset === 0 && day === todayJalali.day
          const hasTask = day ? taskDays.has(day) : false

          return (
            <motion.button
              key={`${displayedJalali.year}-${displayedJalali.month}-${index}`}
              whileHover={day ? { scale: 1.1 } : undefined}
              whileTap={day ? { scale: 0.95 } : undefined}
              disabled={!day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                isToday
                  ? "bg-primary text-white font-bold"
                  : day
                  ? "hover:bg-card-hover text-foreground"
                  : "text-transparent cursor-default"
              }`}
            >
              {day ? toPersianNumber(day) : ""}
              {hasTask && !isToday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />}
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-foreground-muted">امروز</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-foreground-muted">دارای تسک</span>
        </div>
      </div>
    </motion.div>
  )
}
