import type React from "react"
import type { Metadata } from "next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"

export const metadata: Metadata = {
  title: "供应商管理系统",
  description: "基于 Next.js 和 Ant Design 的供应商管理系统",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100 font-sans antialiased">
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: "#ff6b35",
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
