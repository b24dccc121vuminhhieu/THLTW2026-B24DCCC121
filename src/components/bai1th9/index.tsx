import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Typography,
  Statistic,
  message,
  Tabs,
} from "antd";
import {
  PlusOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

type Status = "todo" | "inprogress" | "done";

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: "Cao" | "Trung bình" | "Thấp";
  tag: string;
  status: Status;
}

const statusMap: Record<Status, string> = {
  todo: "Cần làm",
  inprogress: "Đang làm",
  done: "Hoàn thành",
};

const statusColor: Record<Status, string> = {
  todo: "red",
  inprogress: "blue",
  done: "green",
};

const priorityColor: Record<string, string> = {
  Cao: "red",
  "Trung bình": "orange",
  Thấp: "green",
};

const defaultTasks: Task[] = [
  {
    id: "1",
    name: "Thiết kế UI Dashboard",
    description: "Thiết kế giao diện dashboard bằng Ant Design",
    deadline: "2026-05-10",
    priority: "Cao",
    tag: "UI/UX",
    status: "todo",
  },
  {
    id: "2",
    name: "Xây dựng API giả lập",
    description: "Mock dữ liệu task",
    deadline: "2026-05-08",
    priority: "Trung bình",
    tag: "Backend",
    status: "inprogress",
  },
  {
    id: "3",
    name: "Hoàn thiện Kanban",
    description: "Kéo thả task bằng react-beautiful-dnd",
    deadline: "2026-05-06",
    priority: "Cao",
    tag: "React",
    status: "done",
  },
];

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [form] = Form.useForm();

  // Load localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");

    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      setTasks(defaultTasks);
    }
  }, []);

  // Save localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== "done" &&
      dayjs(t.deadline).isBefore(dayjs(), "day")
  ).length;

  const filteredTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => {
        const matchSearch = task.name
          .toLowerCase()
          .includes(searchText.toLowerCase());

        const matchStatus =
          filterStatus === "all" || task.status === filterStatus;

        return matchSearch && matchStatus;
      })
      .sort((a, b) =>
        dayjs(a.deadline).unix() - dayjs(b.deadline).unix()
      );
  }, [tasks, searchText, filterStatus]);

  const openAddModal = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);

    form.setFieldsValue({
      ...task,
      deadline: dayjs(task.deadline),
    });

    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newTask: Task = {
        id: editingTask ? editingTask.id : Date.now().toString(),
        name: values.name,
        description: values.description,
        deadline: values.deadline.format("YYYY-MM-DD"),
        priority: values.priority,
        tag: values.tag,
        status: editingTask ? editingTask.status : "todo",
      };

      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? newTask : t))
        );

        message.success("Cập nhật task thành công");
      } else {
        setTasks((prev) => [...prev, newTask]);

        message.success("Thêm task thành công");
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    message.success("Đã xóa task");
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as Status;
    const destinationStatus = result.destination.droppableId as Status;

    if (sourceStatus === destinationStatus) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === result.draggableId
          ? { ...task, status: destinationStatus }
          : task
      )
    );
  };

  const renderDashboard = () => (
    <>
      <Title level={2}>Dashboard</Title>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số task" value={tasks.length} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Task hoàn thành" value={completedTasks} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Task quá hạn" value={overdueTasks} />
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderKanban = () => {
    const columns: Status[] = ["todo", "inprogress", "done"];

    return (
      <>
        <Row justify="space-between" align="middle">
          <Title level={2}>Kanban Board</Title>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Thêm Task
          </Button>
        </Row>

        <DragDropContext onDragEnd={onDragEnd}>
          <Row gutter={16}>
            {columns.map((status) => (
              <Col span={8} key={status}>
                <Card
                  title={statusMap[status]}
                  style={{ minHeight: 500 }}
                >
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ minHeight: 400 }}
                      >
                        {tasks
                          .filter((task) => task.status === status)
                          .map((task, index) => (
                            <Draggable
                              draggableId={task.id}
                              index={index}
                              key={task.id}
                            >
                              {(provided) => (
                                <Card
                                  size="small"
                                  style={{
                                    marginBottom: 12,
                                    cursor: "grab",
                                  }}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Space direction="vertical">
                                    <Text strong>{task.name}</Text>

                                    <Text type="secondary">
                                      {task.description}
                                    </Text>

                                    <Space>
                                      <Tag color={priorityColor[task.priority]}>
                                        {task.priority}
                                      </Tag>

                                      <Tag>{task.tag}</Tag>
                                    </Space>

                                    <Text>
                                      Deadline: {task.deadline}
                                    </Text>

                                    <Space>
                                      <Button
                                        size="small"
                                        onClick={() =>
                                          openEditModal(task)
                                        }
                                      >
                                        Sửa
                                      </Button>

                                      <Button
                                        size="small"
                                        danger
                                        onClick={() =>
                                          handleDelete(task.id)
                                        }
                                      >
                                        Xóa
                                      </Button>
                                    </Space>
                                  </Space>
                                </Card>
                              )}
                            </Draggable>
                          ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </Col>
            ))}
          </Row>
        </DragDropContext>
      </>
    );
  };

  const columns = [
    {
      title: "Tên task",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      sorter: (a: Task, b: Task) =>
        dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      render: (value: string) => (
        <Tag color={priorityColor[value]}>{value}</Tag>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value: Status) => (
        <Tag color={statusColor[value]}>
          {statusMap[value]}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_: any, record: Task) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>
            Sửa
          </Button>

          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const renderTable = () => (
    <>
      <Row justify="space-between" align="middle">
        <Title level={2}>Danh sách Task</Title>

        <Button type="primary" onClick={openAddModal}>
          Thêm Task
        </Button>
      </Row>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />

        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={(value) => setFilterStatus(value)}
        >
          <Select.Option value="all">Tất cả trạng thái</Select.Option>
          <Select.Option value="todo">Cần làm</Select.Option>
          <Select.Option value="inprogress">Dăng làm</Select.Option>
          <Select.Option value="done">Hoàn thành</Select.Option>
        </Select>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredTasks}
      />
    </>
  );

  return (
    <div style={{ padding: "24px" }}>
      <Tabs
        activeKey={selectedMenu}
        onChange={setSelectedMenu}
      >
        <Tabs.TabPane tab="Dashboard" key="dashboard">
          {renderDashboard()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Kanban Board" key="kanban">
          {renderKanban()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Danh sách Task" key="table">
          {renderTable()}
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingTask ? "Chỉnh sửa Task" : "Thêm Task"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên Task"
            name="name"
            rules={[
              { required: true, message: "Nhập tên task" },
              { min: 3, message: "Tên task ít nhất 3 ký tự" },
              { max: 100, message: "Tên task không quá 100 ký tự" }
            ]}
          >
            <Input placeholder="Nhập tên task" maxLength={100} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description" rules={[{ max: 500, message: "Mô tả không quá 500 ký tự" }]}>
            <Input.TextArea rows={3} placeholder="Nhập mô tả chi tiết (tối đa 500 ký tự)" maxLength={500} />
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: "Chọn ngày deadline" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item
            label="Mức độ ưu tiên"
            name="priority"
            rules={[{ required: true, message: "Chọn mức độ ưu tiên" }]}
          >
            <Select placeholder="Chọn mức độ ưu tiên">
              <Select.Option value="Cao">Cao</Select.Option>
              <Select.Option value="Trung bình">
                Trung bình
              </Select.Option>
              <Select.Option value="Thấp">Thấp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tag"
            name="tag"
            rules={[{ required: true, message: "Nhập tag" }]}
          >
            <Input placeholder="vd: React, Backend, UI/UX" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;