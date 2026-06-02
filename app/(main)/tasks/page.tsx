"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { TopNav } from "@/components/layout/top-nav"
import { TaskCard } from "@/components/tasks/task-card"
import { useApp } from "@/context/app-context"
import { HiOutlineFilter, HiOutlineSearch, HiOutlineViewGrid, HiOutlineViewList, HiOutlineChevronDown } from "react-icons/hi"

const categories = ["همه", "کاری", "شخصی", "یادگیری", "سلامت", "خرید", "سایر"]
const priorities = [
  { value: "all", label: "همه" },
  { value: "high", label: "بالا" },
  { value: "medium", label: "متوسط" },
  { value: "low", label: "پایین" },
]
const statuses = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "completed", label: "تکمیل شده" },
]

export default function TasksPage() {
  const { tasks } = useApp()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("همه")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showFilters, setShowFilters] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                          task.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "همه" || task.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" ||
                          (selectedStatus === "completed" && task.completed) ||
                          (selectedStatus === "pending" && !task.completed)
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  const pendingCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <MainLayout>
      <TopNav
        title="مدیریت تسک‌ها"
        subtitle={`${pendingCount} تسک در انتظار | ${completedCount} تکمیل شده`}
        onSearch={setSearch}
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20">
        {/* Filters Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5"
        >
          {/* Search & View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                placeholder="جستجو در تسک‌ها..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 sm:pr-12 pl-4 py-2.5 sm:py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted text-foreground-secondary hover:bg-card-hover transition-all"
              >
                <HiOutlineFilter className="w-5 h-5" />
                <span className="text-sm">فیلتر</span>
                <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-muted">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <HiOutlineViewList className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <HiOutlineViewGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Chips - Desktop always visible, Mobile collapsible */}
          <div className={`space-y-3 sm:space-y-4 ${showFilters ? "block" : "hidden sm:block"}`}>
            {/* Categories */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-foreground-muted shrink-0 flex items-center gap-2">
                <HiOutlineFilter className="w-4 h-4" />
                دسته‌بندی:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground-secondary hover:bg-card-hover"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority & Status Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-foreground-muted shrink-0">اولویت:</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setSelectedPriority(p.value)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        selectedPriority === p.value
                          ? "bg-secondary text-white"
                          : "bg-muted text-foreground-secondary hover:bg-card-hover"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:mr-auto">
                <span className="text-xs sm:text-sm text-foreground-muted shrink-0">وضعیت:</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStatus(s.value)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        selectedStatus === s.value
                          ? "bg-accent text-white"
                          : "bg-muted text-foreground-secondary hover:bg-card-hover"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tasks List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" : "space-y-3 sm:space-y-4"}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center col-span-full"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <HiOutlineFilter className="w-6 h-6 sm:w-8 sm:h-8 text-foreground-muted" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">تسکی یافت نشد</h3>
                <p className="text-sm text-foreground-muted">
                  با فیلترهای انتخاب شده هیچ تسکی وجود ندارد
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs sm:text-sm text-foreground-muted"
        >
          {filteredTasks.length} تسک نمایش داده شده
        </motion.p>
      </div>
    </MainLayout>
  )
}
