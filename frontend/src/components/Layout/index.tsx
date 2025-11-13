import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout as ArcoLayout, Menu } from '@arco-design/web-react';
import { IconCalendar, IconNav, IconFile, IconDashboard } from '@arco-design/web-react/icon';
import './index.css';

const { Header, Sider, Content } = ArcoLayout;
const MenuItem = Menu.Item;

function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { key: '/calendar', icon: <IconCalendar />, label: '日程管理', path: '/calendar' },
    { key: '/tasks', icon: <IconNav />, label: '任务管理', path: '/tasks' },
    { key: '/notes', icon: <IconFile />, label: '笔记', path: '/notes' },
    { key: '/dashboard', icon: <IconDashboard />, label: '数据面板', path: '/dashboard' },
  ];

  return (
    <ArcoLayout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <div className="logo">
            <IconCalendar style={{ fontSize: 24 }} />
            <span className="logo-text">PlanningHelper</span>
          </div>
        </div>
      </Header>
      <ArcoLayout>
        <Sider className="app-sider" width={200}>
          <Menu selectedKeys={[currentPath]} style={{ width: '100%' }}>
            {menuItems.map((item) => (
              <MenuItem key={item.key}>
                <Link to={item.path} className="menu-link">
                  {item.icon}
                  {item.label}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Sider>
        <Content className="app-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </ArcoLayout>
    </ArcoLayout>
  );
}

export default Layout;
