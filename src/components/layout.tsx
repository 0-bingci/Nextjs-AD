"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const logo = "https://s21.ax1x.com/2025/06/18/pVV9VRs.png";
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
import Image from "next/image";
import { usePathname } from 'next/navigation';
import HomePage from "@/app/home/page";
import PeoplePage from "@/app/people/page";
import FilePage from "@/app/file/page";
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("首页", "1", <PieChartOutlined />),
  getItem("服务器", "sub1", <DesktopOutlined />, [
    getItem("人员管理", "2",<TeamOutlined />),
    getItem("文件管理", "3",<FileOutlined />),
  ]),
];


const App: React.FC = () => {
  const pathname = usePathname();
  const renderContent = () => {
    switch(pathname) {
      case '/people':
        return <PeoplePage />;
      case '/file':
        return <FilePage />;
      default:
        return <HomePage />;
    }
  };
  const renderBreadcrumb = (pathname: string) => { 
    switch(pathname) {
      case '/people':
        return [{title: '服务器'},{title: '人员管理'}];
      case '/file':
        return [{title: '服务器'},{title: '文件管理'}];
      default:
        return [{ title: '首页' }]
    }
    // items={[{ title: "User" }, { title: "Bill" }]}
  };
  
  const router = useRouter();
  const breadcrumbItems = renderBreadcrumb(pathname);
  const getSelectedKeys = (pathname: string) => {
    switch(pathname) {
      case '/people': return ['2'];
      case '/file': return ['3'];
      default: return ['1'];
    }
  };
  const handleMenuClick = (e: { key: string }) => {
    switch(e.key) {
      case '1': 
        router.push('/');
        break;
      case '2':
        router.push('/people');
        break;
      case '3':
        router.push('/file');
        break;
      // 其他菜单项处理
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => {setCollapsed(value)
          
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <Image
            src={logo}
            alt="Logo"
            width={75}
            height={75}
          />
          {!collapsed && (
            <div style={{ fontSize: '20px', fontWeight: 'bold',color:"white"}}>管理系统</div>
          )}
        </div>
        <Menu
          theme="dark"
          selectedKeys={getSelectedKeys(pathname)}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={breadcrumbItems}
          />
          <div
            style={{
              padding: 24,
              minHeight: "80vh",
              
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>实验室管理系统</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
