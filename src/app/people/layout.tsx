import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "人员管理系统",
  description: "基于 Next.js 和 Ant Design 的人员管理系统",
}

export default function PeopleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    {children}
  )
}
