import React from 'react';
import { Card, Form, Input, InputNumber, Button, message, Table, Space, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const ServiceManagement: React.FC = () => {
  const [services, setServices] = React.useState<Service[]>([
    {
      id: '1',
      name: 'Cắt tóc nam',
      description: 'Dịch vụ cắt tóc chuyên nghiệp cho nam',
      price: 50000,
      duration: 30,
    },
    {
      id: '2',
      name: 'Spa mặt',
      description: 'Dịch vụ chăm sóc da mặt chuyên sâu',
      price: 200000,
      duration: 60,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      onOk: () => {
        setServices(services.filter(svc => svc.id !== id));
        message.success('Xóa dịch vụ thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const serviceData: Service = {
        ...values,
        id: editingService ? editingService.id : Date.now().toString(),
      };

      if (editingService) {
        setServices(services.map(svc => svc.id === editingService.id ? serviceData : svc));
        message.success('Cập nhật dịch vụ thành công');
      } else {
        setServices([...services, serviceData]);
        message.success('Thêm dịch vụ thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (description: string) => (
        <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description}
        </div>
      ),
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Service) => (
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
    <Card title="Quản lý dịch vụ" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm dịch vụ</Button>}>
      <Table columns={columns} dataSource={services} rowKey="id" />

      <Modal
        title={editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, type: 'number', min: 0, message: 'Vui lòng nhập giá hợp lệ' }]}>
            <InputNumber style={{ width: '100%' }} min={0} step={1000} />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian thực hiện (phút)" rules={[{ required: true, type: 'number', min: 1, message: 'Vui lòng nhập thời gian hợp lệ' }]}>
            <InputNumber style={{ width: '100%' }} min={1} step={15} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ServiceManagement;