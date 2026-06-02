"use client"

import { ReactNode, useState } from "react"
import { Sidebar } from "./sidebar"
import { motion } from "framer-motion"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="gradient-blob w-64 sm:w-96 h-64 sm:h-96 bg-primary/30 top-20 left-10 sm:left-20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="gradient-blob w-56 sm:w-80 h-56 sm:h-80 bg-secondary/30 bottom-40 right-20 sm:right-40"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="gradient-blob w-48 sm:w-64 h-48 sm:h-64 bg-accent/20 top-1/2 left-1/4 sm:left-1/3"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:mr-72 min-h-screen relative z-10"
      >
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden sticky top-0 z-30 glass-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-foreground">تسک منیجر</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-card-hover transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {children}
      </motion.main>
    </div>
  )
}
