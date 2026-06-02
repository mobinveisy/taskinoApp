"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { HiOutlineClock } from "react-icons/hi"

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

interface TimePickerProps {
  value: string // HH:mm format
  onChange: (time: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [selectedHour, selectedMinute] = useMemo(() => {
    const [h, m] = value.split(":").map(Number)
    return [h || 0, m || 0]
  }, [value])

  const [activeTab, setActiveTab] = useState<"hour" | "minute">("hour")

  const handleHourSelect = (hour: number) => {
    const newTime = `${String(hour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`
    onChange(newTime)
    setActiveTab("minute")
  }

  const handleMinuteSelect = (minute: number) => {
    const newTime = `${String(selectedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    onChange(newTime)
  }

  const formatHour = (hour: number) => {
    return String(hour).padStart(2, "0")
  }

  return (
    <div className="w-full">
      {/* Current Time Display */}
      <div className="flex items-center justify-center gap-2 mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20">
        <HiOutlineClock className="w-5 h-5 text-primary" />
        <div className="flex items-center gap-1 text-2xl font-bold text-foreground font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("hour")}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeTab === "hour" ? "bg-primary text-white" : "hover:bg-card-hover"
            }`}
          >
            {formatHour(selectedHour)}
          </button>
          <span>:</span>
          <button
            type="button"
            onClick={() => setActiveTab("minute")}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeTab === "minute" ? "bg-primary text-white" : "hover:bg-card-hover"
            }`}
          >
            {String(selectedMinute).padStart(2, "0")}
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("hour")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "hour"
              ? "bg-primary text-white"
              : "bg-muted text-foreground-secondary hover:bg-card-hover"
          }`}
        >
          ساعت
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("minute")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "minute"
              ? "bg-primary text-white"
              : "bg-muted text-foreground-secondary hover:bg-card-hover"
          }`}
        >
          دقیقه
        </button>
      </div>

      {/* Time Grid */}
      {activeTab === "hour" ? (
        <div className="grid grid-cols-6 gap-2">
          {hours.map((hour) => (
            <motion.button
              key={hour}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHourSelect(hour)}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                selectedHour === hour
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-card-hover"
              }`}
            >
              {formatHour(hour)}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {minutes.map((minute) => (
            <motion.button
              key={minute}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMinuteSelect(minute)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedMinute === minute
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-card-hover"
              }`}
            >
              {String(minute).padStart(2, "0")}
            </motion.button>
          ))}
        </div>
      )}

      {/* Quick Time Presets */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-foreground-muted mb-2">انتخاب سریع:</p>
        <div className="flex flex-wrap gap-2">
          {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => onChange(time)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                value === time
                  ? "bg-secondary text-white"
                  : "bg-muted/50 text-foreground-secondary hover:bg-card-hover"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
