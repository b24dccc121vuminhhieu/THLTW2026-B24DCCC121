import React from 'react';
import { Card, Form, Select, DatePicker, TimePicker, Button, message, Row, Col, Input } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface Employee {
  id: string;
  name: string;
  maxCustomersPerDay: number;
  workSchedule: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const AppointmentBooking: React.FC = () => {
  const [form] = Form.useForm();

  // Mock data
  const employees: Employee[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      maxCustomersPerDay: 5,
      workSchedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '09:00', end: '17:00' },
        sunday: { start: '09:00', end: '17:00' },
      },
    },
  ];

  const services: Service[] = [
    {
      id: '1',
      name: 'Cắt tóc nam',
      price: 50000,
      duration: 30,
    },
    {
      id: '2',
      name: 'Spa mặt',
      price: 200000,
      duration: 60,
    },
  ];

  const existingAppointments: Appointment[] = [
    {
      id: '1',
      customerName: 'Test Customer',
      customerPhone: '0123456789',
      serviceId: '1',
      employeeId: '1',
      date: dayjs().format('YYYY-MM-DD'),
      startTime: '10:00',
      endTime: '10:30',
      status: 'confirmed',
    },
  ];

  const getDayOfWeek = (date: Dayjs) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.day()];
  };

  const checkAvailability = (employeeId: string, date: Dayjs, startTime: Dayjs, duration: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return false;

    const dayOfWeek = getDayOfWeek(date);
    const workSchedule = employee.workSchedule[dayOfWeek as keyof typeof employee.workSchedule];

    if (!workSchedule) return false;

    const workStart = dayjs(`${date.format('YYYY-MM-DD')} ${workSchedule.start}`);
    const workEnd = dayjs(`${date.format('YYYY-MM-DD')} ${workSchedule.end}`);
    const appointmentStart = dayjs(`${date.format('YYYY-MM-DD')} ${startTime.format('HH:mm')}`);
    const appointmentEnd = appointmentStart.add(duration, 'minute');

    if (appointmentStart.isBefore(workStart) || appointmentEnd.isAfter(workEnd)) {
      return false;
    }

    // Check existing appointments
    const dayAppointments = existingAppointments.filter(
      app => app.employeeId === employeeId && app.date === date.format('YYYY-MM-DD') && app.status !== 'cancelled'
    );

    for (const app of dayAppointments) {
      const existingStart = dayjs(`${app.date} ${app.startTime}`);
      const existingEnd = dayjs(`${app.date} ${app.endTime}`);

      if (appointmentStart.isBefore(existingEnd) && appointmentEnd.isAfter(existingStart)) {
        return false;
      }
    }

    // Check max customers per day
    const confirmedAppointments = dayAppointments.filter(app => app.status === 'confirmed' || app.status === 'completed');
    if (confirmedAppointments.length >= employee.maxCustomersPerDay) {
      return false;
    }

    return true;
  };

  const handleSubmit = (values: any) => {
    const service = services.find(s => s.id === values.serviceId);
    if (!service) {
      message.error('Dịch vụ không tồn tại');
      return;
    }

    const isAvailable = checkAvailability(
      values.employeeId,
      values.date,
      values.startTime,
      service.duration
    );

    if (!isAvailable) {
      message.error('Thời gian này không khả dụng. Vui lòng chọn thời gian khác.');
      return;
    }

    const endTime = values.startTime.add(service.duration, 'minute');

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      serviceId: values.serviceId,
      employeeId: values.employeeId,
      date: values.date.format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
      endTime: endTime.format('HH:mm'),
      status: 'pending',
    };

    // In a real app, this would be sent to the backend
    console.log('New appointment:', newAppointment);
    message.success('Đặt lịch hẹn thành công! Vui lòng chờ xác nhận.');
    form.resetFields();
  };

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Card title="Đặt lịch hẹn" icon={<CalendarOutlined />}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerPhone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serviceId"
              label="Dịch vụ"
              rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
            >
              <Select placeholder="Chọn dịch vụ">
                {services.map(service => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString('vi-VN')} VNĐ ({service.duration} phút)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Nhân viên"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
              <Select placeholder="Chọn nhân viên">
                {employees.map(employee => (
                  <Select.Option key={employee.id} value={employee.id}>
                    {employee.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
            >
              <TimePicker
                style={{ width: '100%' }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Đặt lịch hẹn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppointmentBooking;