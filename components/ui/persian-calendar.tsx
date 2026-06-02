"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi"

// Persian calendar utilities
const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
]

const persianWeekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

// Convert Gregorian to Persian (Jalali)
function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let jy = gy <= 1600 ? 0 : 979
  gy = gy <= 1600 ? gy - 621 : gy - 1600
  const gy2 = gm > 2 ? gy + 1 : gy
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1]
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
  return [jy, jm, jd]
}

// Convert Persian (Jalali) to Gregorian
function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy = jy <= 979 ? 621 : 1600
  jy = jy <= 979 ? jy : jy - 979
  let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4) +
    78 + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186)
  gy += 400 * Math.floor(days / 146097)
  days %= 146097
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524)
    days %= 36524
    if (days >= 365) days++
  }
  gy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    gy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  let gd = days + 1
  const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm = 0
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm]
  return [gy, gm, gd]
}

// Check if Persian year is leap
function isLeapJalali(jy: number): boolean {
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(jy % 33)
}

// Get days in Persian month
function getDaysInJalaliMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isLeapJalali(jy) ? 30 : 29
}

// Get day of week for first day of month (0 = Saturday)
function getFirstDayOfMonth(jy: number, jm: number): number {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, 1)
  const date = new Date(gy, gm - 1, gd)
  // Convert Sunday-based (0-6) to Saturday-based (0-6)
  return (date.getDay() + 1) % 7
}

interface PersianCalendarProps {
  selectedDate: string // Gregorian date string YYYY-MM-DD
  onSelect: (date: string) => void
}

export function PersianCalendar({ selectedDate, onSelect }: PersianCalendarProps) {
  const today = useMemo(() => {
    const now = new Date()
    return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate())
  }, [])

  const selectedJalali = useMemo(() => {
    if (!selectedDate) return today
    const [y, m, d] = selectedDate.split("-").map(Number)
    return gregorianToJalali(y, m, d)
  }, [selectedDate, today])

  const [viewYear, setViewYear] = useState(selectedJalali[0])
  const [viewMonth, setViewMonth] = useState(selectedJalali[1])

  const calendarDays = useMemo(() => {
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
    const daysInMonth = getDaysInJalaliMonth(viewYear, viewMonth)
    const days: (number | null)[] = []
    
    // Add empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d)
    }
    
    return days
  }, [viewYear, viewMonth])

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const [gy, gm, gd] = jalaliToGregorian(viewYear, viewMonth, day)
    const dateStr = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`
    onSelect(dateStr)
  }

  const isSelected = (day: number) => {
    return viewYear === selectedJalali[0] && 
           viewMonth === selectedJalali[1] && 
           day === selectedJalali[2]
  }

  const isToday = (day: number) => {
    return viewYear === today[0] && viewMonth === today[1] && day === today[2]
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-card-hover transition-colors"
        >
          <HiOutlineChevronLeft className="w-5 h-5 text-foreground-muted" />
        </button>
        <div className="text-center">
          <span className="font-bold text-foreground">
            {persianMonths[viewMonth - 1]} {viewYear}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-card-hover transition-colors"
        >
          <HiOutlineChevronRight className="w-5 h-5 text-foreground-muted" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {persianWeekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-foreground-muted py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="wait">
          {calendarDays.map((day, idx) => (
            <motion.div
              key={`${viewYear}-${viewMonth}-${idx}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1, delay: idx * 0.01 }}
            >
              {day ? (
                <button
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-full aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
                    isSelected(day)
                      ? "bg-primary text-white font-bold"
                      : isToday(day)
                      ? "bg-primary/20 text-primary font-medium"
                      : "hover:bg-card-hover text-foreground"
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div className="w-full aspect-square" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected date display */}
      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-sm text-foreground-muted">
          تاریخ انتخابی: <span className="text-foreground font-medium">
            {selectedJalali[2]} {persianMonths[selectedJalali[1] - 1]} {selectedJalali[0]}
          </span>
        </p>
      </div>
    </div>
  )
}
