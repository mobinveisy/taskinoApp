"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineInformationCircle, HiOutlineExclamationCircle } from "react-icons/hi"

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  priority: "high" | "medium" | "low"
  dueDate: string
  dueTime: string
  duration: number
  completed: boolean
  createdAt: string
  smsReminder?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
}

interface RegisteredUser extends User {
  password: string
}

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  message: string
}

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  tasks: Task[]
  smsSettings: {
    enabled: boolean
    apiKey: string
    sender: string
    reminderMinutes: number
  }
  darkMode: boolean
  notifications: Notification[]
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, phone: string, password: string) => boolean
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  updateSmsSettings: (settings: Partial<AppContextType["smsSettings"]>) => void
  setDarkMode: (enabled: boolean) => void
  addNotification: (message: string, type: "success" | "error" | "info" | "warning") => void
  removeNotification: (id: string) => void
  sendSmsReminder: (task: Task) => Promise<boolean>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Test accounts
const testAccounts: RegisteredUser[] = [
  {
    id: "1",
    name: "علی احمدی",
    email: "test@test.com",
    phone: "09123456789",
    password: "2404",
  },
  {
    id: "2",
    name: "کاربر تست",
    email: "admin@admin.com",
    phone: "09111111111",
    password: "admin",
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "جلسه با تیم توسعه",
    description: "بررسی پیشرفت پروژه و برنامه‌ریزی اسپرینت جدید",
    category: "کاری",
    priority: "high",
    dueDate: "2026-05-15",
    dueTime: "10:00",
    duration: 60,
    completed: false,
    createdAt: "2026-05-14T08:00:00Z",
    smsReminder: true,
  },
  {
    id: "2",
    title: "ارسال گزارش هفتگی",
    description: "تهیه و ارسال گزارش عملکرد هفتگی به مدیریت",
    category: "کاری",
    priority: "medium",
    dueDate: "2026-05-15",
    dueTime: "14:00",
    duration: 30,
    completed: true,
    createdAt: "2026-05-13T10:00:00Z",
  },
  {
    id: "3",
    title: "خرید هفتگی",
    description: "خرید مایحتاج هفته از فروشگاه",
    category: "شخصی",
    priority: "low",
    dueDate: "2026-05-16",
    dueTime: "18:00",
    duration: 90,
    completed: false,
    createdAt: "2026-05-14T12:00:00Z",
  },
  {
    id: "4",
    title: "مطالعه کتاب",
    description: "مطالعه فصل سوم کتاب برنامه‌نویسی",
    category: "یادگیری",
    priority: "medium",
    dueDate: "2026-05-15",
    dueTime: "21:00",
    duration: 45,
    completed: false,
    createdAt: "2026-05-14T09:00:00Z",
    smsReminder: true,
  },
  {
    id: "5",
    title: "ورزش صبحگاهی",
    description: "دویدن و تمرینات کششی",
    category: "سلامت",
    priority: "high",
    dueDate: "2026-05-16",
    dueTime: "07:00",
    duration: 45,
    completed: false,
    createdAt: "2026-05-14T07:00:00Z",
  },
  {
    id: "6",
    title: "تماس با پشتیبانی",
    description: "پیگیری سفارش و هماهنگی ارسال",
    category: "شخصی",
    priority: "medium",
    dueDate: "2026-05-17",
    dueTime: "11:00",
    duration: 15,
    completed: false,
    createdAt: "2026-05-14T14:00:00Z",
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [registeredUsers, setRegisteredUsers] = useState(testAccounts)
  const [darkMode, setDarkModeState] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [smsSettings, setSmsSettings] = useState({
    enabled: false,
    apiKey: "",
    sender: "",
    reminderMinutes: 30,
  })

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated")
    const savedUser = localStorage.getItem("user")
    const savedTasks = localStorage.getItem("tasks")
    const savedUsers = localStorage.getItem("registeredUsers")
    const savedSmsSettings = localStorage.getItem("smsSettings")
    const savedDarkMode = localStorage.getItem("darkMode")
    
    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks(mockTasks)
    }

    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers))
    }

    if (savedSmsSettings) {
      setSmsSettings(JSON.parse(savedSmsSettings))
    }

    if (savedDarkMode !== null) {
      setDarkModeState(JSON.parse(savedDarkMode))
    }

    // Apply dark mode to HTML
    const isDark = savedDarkMode !== null ? JSON.parse(savedDarkMode) : true
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
  }, [registeredUsers])

  useEffect(() => {
    localStorage.setItem("smsSettings", JSON.stringify(smsSettings))
  }, [smsSettings])

  const login = (email: string, password: string): boolean => {
    const foundUser = registeredUsers.find(
      (u) => (u.email === email || u.phone === email) && u.password === password
    )
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setIsAuthenticated(true)
      setUser(userWithoutPassword)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const signup = (name: string, email: string, phone: string, password: string): boolean => {
    // Check if email or phone already exists
    const exists = registeredUsers.some((u) => u.email === email || u.phone === phone)
    if (exists) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password,
    }
    
    setRegisteredUsers((prev) => [...prev, newUser])
    
    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser
    setIsAuthenticated(true)
    setUser(userWithoutPassword)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    
    return true
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      setRegisteredUsers((prev) =>
        prev.map((registeredUser) =>
          registeredUser.id === updatedUser.id ? { ...registeredUser, ...updates } : registeredUser
        )
      )
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const updateSmsSettings = (settings: Partial<AppContextType["smsSettings"]>) => {
    setSmsSettings((prev) => ({ ...prev, ...settings }))
  }

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled)
    localStorage.setItem("darkMode", JSON.stringify(enabled))
    if (enabled) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const addNotification = (message: string, type: "success" | "error" | "info" | "warning") => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: Notification = { id, message, type }
    setNotifications((prev) => [...prev, notification])
    
    // Auto-remove after 3 seconds
    setTimeout(() => removeNotification(id), 3000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const sendSmsReminder = async (task: Task): Promise<boolean> => {
    if (!smsSettings.enabled || !user?.phone) {
      return false
    }

    try {
      // Kavenegar API call simulation
      const message = `یادآوری: ${task.title} - ساعت ${task.dueTime}`
      
      // In production, this would be a server-side API call
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receptor: user.phone,
          message,
        }),
      })

      return response.ok
    } catch {
      console.error("SMS sending failed")
      return false
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        tasks,
        smsSettings,
        darkMode,
        notifications,
        login,
        signup,
        logout,
        updateUser,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        updateSmsSettings,
        setDarkMode,
        addNotification,
        removeNotification,
        sendSmsReminder,
      }}
    >
      {children}
      
      {/* Notification Display */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => {
            const getIcon = () => {
              switch (notification.type) {
                case "success":
                  return <HiOutlineCheckCircle className="w-5 h-5 text-green-400" />
                case "error":
                  return <HiOutlineXCircle className="w-5 h-5 text-red-400" />
                case "warning":
                  return <HiOutlineExclamationCircle className="w-5 h-5 text-yellow-400" />
                default:
                  return <HiOutlineInformationCircle className="w-5 h-5 text-blue-400" />
              }
            }

            const getBgColor = () => {
              switch (notification.type) {
                case "success":
                  return "bg-green-500/20 border-green-500/30"
                case "error":
                  return "bg-red-500/20 border-red-500/30"
                case "warning":
                  return "bg-yellow-500/20 border-yellow-500/30"
                default:
                  return "bg-blue-500/20 border-blue-500/30"
              }
            }

            return (
              <motion.div
                key={notification.id}
                initial={{ y: 20, opacity: 0, x: 100 }}
                animate={{ y: 0, opacity: 1, x: 0 }}
                exit={{ y: 20, opacity: 0, x: 100 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md ${getBgColor()} pointer-events-auto`}
              >
                {getIcon()}
                <p className="text-sm font-medium text-foreground flex-1">{notification.message}</p>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-foreground-muted hover:text-foreground transition-colors shrink-0"
                >
                  ✕
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
