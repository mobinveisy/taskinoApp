"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineCheck, HiOutlineClock, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi"
import { Task, useApp } from "@/context/app-context"
import { EditTaskModal } from "./edit-task-modal"

interface TaskCardProps {
  task: Task
  index: number
}

const priorityColors = {
  high: "border-r-destructive",
  medium: "border-r-amber-500",
  low: "border-r-green-500",
}

const priorityBadgeColors = {
  high: "bg-destructive/20 text-destructive",
  medium: "bg-amber-500/20 text-amber-400",
  low: "bg-green-500/20 text-green-400",
}

const priorityLabels = {
  high: "بالا",
  medium: "متوسط",
  low: "پایین",
}

export function TaskCard({ task, index }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { toggleTaskComplete, deleteTask, addNotification } = useApp()

  const handleDelete = () => {
    deleteTask(task.id)
    addNotification("تسک حذف شد", "success")
  }

  const handleToggleComplete = () => {
    toggleTaskComplete(task.id)
    const message = task.completed ? "تسک به وضعیت آغاز برگشت" : "تسک تکمیل شد"
    addNotification(message, "success")
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.01 }}
      className={`glass-card glass-card-hover rounded-2xl p-5 border-r-4 ${priorityColors[task.priority]} ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? "bg-primary border-primary"
              : "border-foreground-muted hover:border-primary"
          }`}
        >
          {task.completed && <HiOutlineCheck className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className={`font-bold text-foreground ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-foreground-muted mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => setIsEditOpen(true)}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors text-foreground-muted hover:text-foreground"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-foreground-muted hover:text-destructive"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground-secondary text-xs font-medium">
              {task.category}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${priorityBadgeColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <HiOutlineClock className="w-3.5 h-3.5" />
              <span>{task.dueTime}</span>
              <span className="text-foreground-muted/50">|</span>
              <span>{task.duration} دقیقه</span>
            </div>
            <span className="text-xs text-foreground-muted mr-auto">
              {task.dueDate}
            </span>
          </div>
        </div>
      </div>

      <EditTaskModal
        isOpen={isEditOpen}
        task={task}
        onClose={() => setIsEditOpen(false)}
      />
    </motion.div>
  )
}
