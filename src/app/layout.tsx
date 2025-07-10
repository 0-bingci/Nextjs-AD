"use client";
import "./globals.css";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Layout from "../components/layout";
import { usePathname, useRouter } from "next/navigation";
import Login from "./login/page";
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  
  if (pathname === "/login") {
    return (
      <html lang="en">
        <body>
          <Login />
        </body>
      </html>
    );
  }

  useAuthRedirect();
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

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn && pathname !== '/login') {  
      router.push('/login');
    }
  }, [pathname, router]);
}

