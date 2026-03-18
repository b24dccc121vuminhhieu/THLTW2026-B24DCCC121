import React from 'react';
import { Card, Table, Button, Space, Modal, Form, InputNumber, message, Tag, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([
    {
      id: '1',
      customerName: 'Nguyễn Văn B',
      customerPhone: '0123456789',
      serviceName: 'Cắt tóc nam',
      employeeName: 'Nguyễn Văn A',
      date: dayjs().format('YYYY-MM-DD'),
      startTime: '10:00',
      endTime: '10:30',
      status: 'confirmed',
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
      status: 'pending',
      price: 200000,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingAppointment, setEditingAppointment] = React.useState<Appointment | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    form.setFieldsValue({
      status: appointment.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      onOk: () => {
        setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'cancelled' } : app));
        message.success('Hủy lịch hẹn thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingAppointment) {
        setAppointments(appointments.map(app =>
          app.id === editingAppointment.id
            ? { ...app, status: values.status }
            : app
        ));
        message.success('Cập nhật lịch hẹn thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'confirmed':
        return 'Xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Hủy';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'SĐT',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      key: 'time',
      render: (_: any, record: Appointment) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Appointment) => (
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
            Hủy
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý lịch hẹn">
      <Table columns={columns} dataSource={appointments} rowKey="id" scroll={{ x: 1000 }} />

      <Modal
        title="Cập nhật trạng thái lịch hẹn"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="pending">Chờ duyệt</Select.Option>
              <Select.Option value="confirmed">Xác nhận</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="cancelled">Hủy</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AppointmentManagement;