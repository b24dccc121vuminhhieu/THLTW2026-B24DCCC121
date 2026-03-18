import React from 'react';
import { Card, Table, Button, Space, Rate, Modal, Form, Input, message, Avatar } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Rating {
  id: string;
  appointmentId: string;
  customerName: string;
  employeeName: string;
  serviceName: string;
  rating: number;
  comment: string;
  employeeReply?: string;
  date: string;
}

const RatingManagement: React.FC = () => {
  const [ratings, setRatings] = React.useState<Rating[]>([
    {
      id: '1',
      appointmentId: '1',
      customerName: 'Nguyễn Văn B',
      employeeName: 'Nguyễn Văn A',
      serviceName: 'Cắt tóc nam',
      rating: 5,
      comment: 'Dịch vụ rất tốt, nhân viên thân thiện',
      employeeReply: 'Cảm ơn bạn đã đánh giá tốt!',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    },
    {
      id: '2',
      appointmentId: '2',
      customerName: 'Trần Thị C',
      employeeName: 'Nguyễn Văn A',
      serviceName: 'Spa mặt',
      rating: 4,
      comment: 'Dịch vụ ổn nhưng chờ hơi lâu',
      date: dayjs().format('YYYY-MM-DD'),
    },
  ]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [replyingRating, setReplyingRating] = React.useState<Rating | null>(null);
  const [form] = Form.useForm();

  const handleReply = (rating: Rating) => {
    setReplyingRating(rating);
    form.setFieldsValue({
      reply: rating.employeeReply || '',
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (replyingRating) {
        setRatings(ratings.map(rating =>
          rating.id === replyingRating.id
            ? { ...rating, employeeReply: values.reply }
            : rating
        ));
        message.success('Phản hồi thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getAverageRating = (employeeName: string) => {
    const employeeRatings = ratings.filter(r => r.employeeName === employeeName);
    if (employeeRatings.length === 0) return 0;
    const sum = employeeRatings.reduce((acc, r) => acc + r.rating, 0);
    return sum / employeeRatings.length;
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {name}
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      width: 200,
      render: (comment: string) => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {comment}
        </div>
      ),
    },
    {
      title: 'Phản hồi',
      dataIndex: 'employeeReply',
      key: 'employeeReply',
      width: 200,
      render: (reply: string) => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: 'italic' }}>
          {reply || 'Chưa có phản hồi'}
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Rating) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<MessageOutlined />}
            onClick={() => handleReply(record)}
          >
            Phản hồi
          </Button>
        </Space>
      ),
    },
  ];

  const employeeStats = React.useMemo(() => {
    const stats: { [key: string]: { total: number; average: number } } = {};
    ratings.forEach(rating => {
      if (!stats[rating.employeeName]) {
        stats[rating.employeeName] = { total: 0, average: 0 };
      }
      stats[rating.employeeName].total += 1;
    });

    Object.keys(stats).forEach(employee => {
      stats[employee].average = getAverageRating(employee);
    });

    return stats;
  }, [ratings]);

  return (
    <div>
      <Card title="Thống kê đánh giá nhân viên" style={{ marginBottom: 16 }}>
        <Table
          columns={[
            {
              title: 'Nhân viên',
              dataIndex: 'employee',
              key: 'employee',
            },
            {
              title: 'Số đánh giá',
              dataIndex: 'total',
              key: 'total',
            },
            {
              title: 'Đánh giá trung bình',
              dataIndex: 'average',
              key: 'average',
              render: (average: number) => <Rate disabled defaultValue={average} />,
            },
          ]}
          dataSource={Object.entries(employeeStats).map(([employee, stats]) => ({
            employee,
            total: stats.total,
            average: stats.average,
          }))}
          rowKey="employee"
          pagination={false}
        />
      </Card>

      <Card title="Quản lý đánh giá">
        <Table columns={columns} dataSource={ratings} rowKey="id" />
      </Card>

      <Modal
        title="Phản hồi đánh giá"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="reply" label="Nội dung phản hồi" rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}>
            <Input.TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RatingManagement;