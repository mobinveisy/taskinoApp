"use client"

import { motion } from "framer-motion"
import { HiOutlineSearch, HiOutlinePlus, HiOutlineLogout } from "react-icons/hi"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/app-context"
import { AddTaskModal } from "@/components/tasks/add-task-modal"

interface TopNavProps {
  title: string
  subtitle?: string
  onSearch?: (query: string) => void
}

export function TopNav({ title, subtitle, onSearch }: TopNavProps) {
  const router = useRouter()
  const { logout } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 lg:top-0 z-20 glass-card border-t-0 border-r-0 border-l-0 px-4 sm:px-6 py-3 sm:py-4"
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-foreground truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-foreground-muted truncate">{subtitle}</p>
            )}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                placeholder="جستجوی تسک..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-xl hover:bg-card-hover transition-colors"
          >
            <HiOutlineSearch className="w-5 h-5 text-foreground-muted" />
          </button>

          {/* Add Task Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:opacity-90 transition-opacity glow-primary text-sm sm:text-base"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span className="hidden sm:inline">افزودن تسک</span>
          </motion.button>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-destructive/20 text-destructive transition-colors"
            title="خروج"
          >
            <HiOutlineLogout className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Mobile Search Expanded */}
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pt-3 border-t border-border"
          >
            <div className="relative">
              <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                placeholder="جستجوی تسک..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </motion.header>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  )
}
