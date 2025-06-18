import "./globals.css";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Layout from "../components/layout";
interface LayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
        <Layout {...({ children } as any)}>
        {children}
        </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
