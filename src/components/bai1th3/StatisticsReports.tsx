import React from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker } from 'antd';
import { DollarOutlined, UserOutlined, CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

const StatisticsReports: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

  // Mock data
  const appointments: Appointment[] = [
    {
      id: '1',
      customerName: 'Nguyễn Văn B',
      customerPhone: '0123456789',
      serviceName: 'Cắt tóc nam',
      employeeName: 'Nguyễn Văn A',
      date: dayjs().format('YYYY-MM-DD'),
      startTime: '10:00',
      endTime: '10:30',
      status: 'completed',
      price: 50000,
    },
    {
      id: '2',
      customerName: 'Trần Thị C',
      customerPhone: '0987654321',
      serviceName: 'Spa mặt',
      employeeName: 'Nguyễn Văn A',
      date: dayjs().format('YYYY-MM-DD'),
      startTime: '14:00',
      endTime: '15:00',
      status: 'completed',
      price: 200000,
    },
    {
      id: '3',
      customerName: 'Lê Văn D',
      customerPhone: '0111111111',
      serviceName: 'Cắt tóc nam',
      employeeName: 'Nguyễn Văn A',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      startTime: '09:00',
      endTime: '09:30',
      status: 'completed',
      price: 50000,
    },
  ];

  const filteredAppointments = React.useMemo(() => {
    if (!selectedDate) return appointments;
    return appointments.filter(app => app.date === selectedDate.format('YYYY-MM-DD'));
  }, [appointments, selectedDate]);

  const stats = React.useMemo(() => {
    const completedAppointments = filteredAppointments.filter(app => app.status === 'completed');

    const totalRevenue = completedAppointments.reduce((sum, app) => sum + app.price, 0);
    const totalAppointments = completedAppointments.length;
    const uniqueCustomers = new Set(completedAppointments.map(app => app.customerPhone)).size;

    const serviceRevenue: { [key: string]: number } = {};
    const employeeRevenue: { [key: string]: number } = {};

    completedAppointments.forEach(app => {
      serviceRevenue[app.serviceName] = (serviceRevenue[app.serviceName] || 0) + app.price;
      employeeRevenue[app.employeeName] = (employeeRevenue[app.employeeName] || 0) + app.price;
    });

    return {
      totalRevenue,
      totalAppointments,
      uniqueCustomers,
      serviceRevenue,
      employeeRevenue,
    };
  }, [filteredAppointments]);

  const serviceColumns = [
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `${revenue.toLocaleString('vi-VN')} VNĐ`,
    },
  ];

  const employeeColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `${revenue.toLocaleString('vi-VN')} VNĐ`,
    },
  ];

  return (
    <div>
      <Card title="Thống kê & báo cáo" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <DatePicker
              placeholder="Chọn ngày"
              onChange={setSelectedDate}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Số lịch hẹn hoàn thành"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Số khách hàng"
              value={stats.uniqueCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Doanh thu trung bình/lịch hẹn"
              value={stats.totalAppointments > 0 ? Math.round(stats.totalRevenue / stats.totalAppointments) : 0}
              prefix={<BarChartOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Doanh thu theo dịch vụ">
            <Table
              columns={serviceColumns}
              dataSource={Object.entries(stats.serviceRevenue).map(([service, revenue]) => ({
                service,
                revenue,
              }))}
              rowKey="service"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo nhân viên">
            <Table
              columns={employeeColumns}
              dataSource={Object.entries(stats.employeeRevenue).map(([employee, revenue]) => ({
                employee,
                revenue,
              }))}
              rowKey="employee"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsReports;