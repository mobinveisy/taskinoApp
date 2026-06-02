"use client"

import { AppProvider } from "@/context/app-context"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppProvider>{children}</AppProvider>
}
