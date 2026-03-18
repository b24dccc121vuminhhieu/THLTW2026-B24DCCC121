import { useState } from "react";
import { Button, Form, Input, Select, Table, Modal, Card, Popconfirm } from "antd";

const { Option } = Select;

type Difficulty = "Dễ" | "Trung bình" | "Khó" | "Rất khó";

interface Question {
  id: string;
  subject: string;
  block: string;
  difficulty: Difficulty;
  content: string;
}

export default function Bai2() {

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editing, setEditing] = useState<Question | null>(null);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const addQuestion = (values: Question) => {
    setQuestions(prev => [...prev, values]);
    form.resetFields();
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const openEdit = (record: Question) => {
    setEditing(record);
    setOpen(true);

    setTimeout(() => {
      editForm.setFieldsValue(record);
    }, 0);
  };

  const saveEdit = async () => {

    const values = await editForm.validateFields();

    setQuestions(prev =>
      prev.map(q =>
        q.id === editing?.id ? { ...q, ...values } : q
      )
    );

    setOpen(false);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "id"
    },
    {
      title: "Môn",
      dataIndex: "subject"
    },
    {
      title: "Khối",
      dataIndex: "block"
    },
    {
      title: "Độ khó",
      dataIndex: "difficulty"
    },
    {
      title: "Nội dung",
      dataIndex: "content"
    },
    {
      title: "Hành động",
      render: (_: any, record: Question) => (
        <>
          <Button type="link" onClick={() => openEdit(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Xóa câu hỏi?"
            onConfirm={() => deleteQuestion(record.id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 40 }}>

      <Card title="Thêm câu hỏi">

        <Form
          form={form}
          layout="vertical"
          onFinish={addQuestion}
        >

          <Form.Item
            name="id"
            label="Mã câu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="subject" label="Môn học">
            <Input />
          </Form.Item>

          <Form.Item name="block" label="Khối kiến thức">
            <Input />
          </Form.Item>

          <Form.Item name="difficulty" label="Độ khó">
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input.TextArea />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Thêm
          </Button>

        </Form>

      </Card>

      <Card title="Danh sách câu hỏi" style={{ marginTop: 20 }}>

        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
        />

      </Card>

      <Modal
        title="Chỉnh sửa câu hỏi"
        open={open}
        onOk={saveEdit}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >

        <Form form={editForm} layout="vertical">

          <Form.Item name="id" label="Mã câu">
            <Input disabled />
          </Form.Item>

          <Form.Item name="subject" label="Môn">
            <Input />
          </Form.Item>

          <Form.Item name="block" label="Khối">
            <Input />
          </Form.Item>

          <Form.Item name="difficulty" label="Độ khó">
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input.TextArea />
          </Form.Item>

        </Form>

      </Modal>

    </div>
  );
}