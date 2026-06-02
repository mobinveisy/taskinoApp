"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineLightBulb,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineX,
} from "react-icons/hi"
import { useApp } from "@/context/app-context"

const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: HiOutlineHome },
  { href: "/tasks", label: "تسک‌ها", icon: HiOutlineClipboardList },
  { href: "/ai-planning", label: "برنامه‌ریزی هوشمند", icon: HiOutlineLightBulb },
  { href: "/settings", label: "تنظیمات", icon: HiOutlineCog },
  { href: "/profile", label: "پروفایل", icon: HiOutlineUser },
  { href: "/notifications", label: "اعلان‌ها", icon: HiOutlineBell },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useApp()

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <span className="text-white font-bold text-base sm:text-lg">T</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-base sm:text-lg">تسک منیجر</h1>
            <p className="text-xs text-foreground-muted">مدیریت هوشمند کارها</p>
          </div>
        </motion.div>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-card-hover transition-colors"
          >
            <HiOutlineX className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.href}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary/20 text-primary glow-primary"
                    : "hover:bg-card-hover text-foreground-secondary hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-primary" : ""
                  }`}
                />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 sm:p-4 border-t border-border space-y-2 sm:space-y-3">
        {/* Notifications */}


        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 glass-card rounded-xl">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm sm:text-base">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
              <p className="text-xs text-foreground-muted truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => {
            logout()
            handleLinkClick()
          }}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-destructive/10 transition-all duration-300 text-destructive"
        >
          <HiOutlineLogout className="w-5 h-5" />
          <span className="font-medium text-sm sm:text-base">خروج</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:flex fixed right-0 top-0 h-screen w-72 glass-card border-l-0 border-t-0 border-b-0 flex-col z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 h-screen w-72 max-w-[85vw] glass-card border-l border-border flex flex-col z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
