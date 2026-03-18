import React from 'react';
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, CalendarOutlined, StarOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import EmployeeManagement from './EmployeeManagement';
import ServiceManagement from './ServiceManagement';
import AppointmentBooking from './AppointmentBooking';
import AppointmentManagement from './AppointmentManagement';
import RatingManagement from './RatingManagement';
import StatisticsReports from './StatisticsReports';

const { Header, Content, Sider } = Layout;

const AppointmentSystem: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = React.useState('booking');

  const menuItems = [
    {
      key: 'booking',
      icon: <CalendarOutlined />,
      label: 'Đặt lịch hẹn',
    },
    {
      key: 'management',
      icon: <SettingOutlined />,
      label: 'Quản lý lịch hẹn',
    },
    {
      key: 'employees',
      icon: <UserOutlined />,
      label: 'Quản lý nhân viên',
    },
    {
      key: 'services',
      icon: <SettingOutlined />,
      label: 'Quản lý dịch vụ',
    },
    {
      key: 'ratings',
      icon: <StarOutlined />,
      label: 'Đánh giá & phản hồi',
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: 'Thống kê & báo cáo',
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'booking':
        return <AppointmentBooking />;
      case 'management':
        return <AppointmentManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'ratings':
        return <RatingManagement />;
      case 'statistics':
        return <StatisticsReports />;
      default:
        return <AppointmentBooking />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          selectedKeys={[selectedMenu]}
          mode="inline"
          items={menuItems}
          onClick={(e) => setSelectedMenu(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 24px', fontSize: '20px', fontWeight: 'bold' }}>
            Hệ thống quản lý lịch hẹn dịch vụ
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppointmentSystem;