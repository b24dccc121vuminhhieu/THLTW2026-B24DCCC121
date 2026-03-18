import React from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, TimePicker, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  rating: number;
  totalRatings: number;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'a@example.com',
      phone: '0123456789',
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
      rating: 4.5,
      totalRatings: 10,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);
  const [form] = Form.useForm();

  const daysOfWeek = [
    { key: 'monday', label: 'Thứ 2' },
    { key: 'tuesday', label: 'Thứ 3' },
    { key: 'wednesday', label: 'Thứ 4' },
    { key: 'thursday', label: 'Thứ 5' },
    { key: 'friday', label: 'Thứ 6' },
    { key: 'saturday', label: 'Thứ 7' },
    { key: 'sunday', label: 'Chủ nhật' },
  ];

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      ...employee,
      workSchedule: Object.entries(employee.workSchedule).map(([day, schedule]) => ({
        day,
        start: dayjs(schedule.start, 'HH:mm'),
        end: dayjs(schedule.end, 'HH:mm'),
      })),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      onOk: () => {
        setEmployees(employees.filter(emp => emp.id !== id));
        message.success('Xóa nhân viên thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const workSchedule: Employee['workSchedule'] = {} as Employee['workSchedule'];
      values.workSchedule.forEach((item: any) => {
        workSchedule[item.day as keyof Employee['workSchedule']] = {
          start: item.start.format('HH:mm'),
          end: item.end.format('HH:mm'),
        };
      });

      const employeeData: Employee = {
        ...values,
        workSchedule,
        id: editingEmployee ? editingEmployee.id : Date.now().toString(),
        rating: editingEmployee ? editingEmployee.rating : 0,
        totalRatings: editingEmployee ? editingEmployee.totalRatings : 0,
      };

      if (editingEmployee) {
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? employeeData : emp));
        message.success('Cập nhật nhân viên thành công');
      } else {
        setEmployees([...employees, employeeData]);
        message.success('Thêm nhân viên thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Khách/ngày',
      dataIndex: 'maxCustomersPerDay',
      key: 'maxCustomersPerDay',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number, record: Employee) => (
        <span>{rating.toFixed(1)} ({record.totalRatings})</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý nhân viên" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm nhân viên</Button>}>
      <Table columns={columns} dataSource={employees} rowKey="id" />

      <Modal
        title={editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maxCustomersPerDay" label="Số khách tối đa/ngày" rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập số > 0' }]}>
            <Input type="number" />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <strong>Lịch làm việc:</strong>
          </div>
          <Form.List name="workSchedule">
            {(fields) => (
              <>
                {daysOfWeek.map((day, index) => (
                  <div key={day.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: 80 }}>{day.label}:</span>
                    <Form.Item
                      name={[index, 'day']}
                      initialValue={day.key}
                      style={{ display: 'none' }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[index, 'start']}
                      rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
                      style={{ marginRight: 8 }}
                    >
                      <TimePicker format="HH:mm" />
                    </Form.Item>
                    <span>đến</span>
                    <Form.Item
                      name={[index, 'end']}
                      rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}
                      style={{ marginLeft: 8 }}
                    >
                      <TimePicker format="HH:mm" />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default EmployeeManagement;