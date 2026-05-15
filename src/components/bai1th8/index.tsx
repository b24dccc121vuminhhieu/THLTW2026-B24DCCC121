import React, { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Popconfirm,
  Drawer,
  Progress,
  Segmented,
  Timeline,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const workoutTypes = ["Cardio", "Strength", "Yoga", "HIIT", "Other"];
const muscleGroups = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
];

const difficultyColors: any = {
  Dễ: "green",
  "Trung bình": "orange",
  Khó: "red",
};

const bmiTag = (bmi: number) => {
  if (bmi < 18.5) return { color: "blue", text: "Thiếu cân" };
  if (bmi < 25) return { color: "green", text: "Bình thường" };
  if (bmi < 30) return { color: "gold", text: "Thừa cân" };
  return { color: "red", text: "Béo phì" };
};

export default function Index() {
  const [page, setPage] = useState("dashboard");

  // =========================
  // WORKOUTS
  // =========================

  const [workouts, setWorkouts] = useState<any[]>([
    {
      id: 1,
      date: "2026-05-01",
      type: "Cardio",
      duration: 45,
      calories: 400,
      note: "Morning Run",
      status: "Hoàn thành",
    },
    {
      id: 2,
      date: "2026-05-03",
      type: "Strength",
      duration: 60,
      calories: 550,
      note: "Upper Body",
      status: "Hoàn thành",
    },
    {
      id: 3,
      date: "2026-05-05",
      type: "Yoga",
      duration: 40,
      calories: 180,
      note: "Recovery",
      status: "Bỏ lỡ",
    },
  ]);

  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);

  const [workoutSearch, setWorkoutSearch] = useState("");
  const [workoutFilterType, setWorkoutFilterType] = useState("");
  const [workoutRange, setWorkoutRange] = useState<any>(null);

  const [workoutForm] = Form.useForm();

  const openWorkoutModal = (record?: any) => {
    if (record) {
      setEditingWorkout(record);
      workoutForm.setFieldsValue({
        ...record,
        date: dayjs(record.date),
      });
    } else {
      setEditingWorkout(null);
      workoutForm.resetFields();
    }

    setWorkoutOpen(true);
  };

  const saveWorkout = () => {
    workoutForm.validateFields().then((values) => {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editingWorkout) {
        setWorkouts((prev) =>
          prev.map((w) =>
            w.id === editingWorkout.id
              ? { ...editingWorkout, ...payload }
              : w
          )
        );
        message.success("Đã cập nhật buổi tập");
      } else {
        setWorkouts((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...payload,
          },
        ]);
        message.success("Đã thêm buổi tập");
      }

      setWorkoutOpen(false);
    });
  };

  const filteredWorkouts = workouts.filter((w) => {
    const matchSearch = w.note
      .toLowerCase()
      .includes(workoutSearch.toLowerCase());

    const matchType = workoutFilterType
      ? w.type === workoutFilterType
      : true;

    const matchDate = workoutRange
      ? dayjs(w.date).isAfter(workoutRange[0].subtract(1, "day")) &&
        dayjs(w.date).isBefore(workoutRange[1].add(1, "day"))
      : true;

    return matchSearch && matchType && matchDate;
  });

  // =========================
  // HEALTH
  // =========================

  const [healthData, setHealthData] = useState<any[]>([
    {
      id: 1,
      date: "2026-05-01",
      weight: 70,
      height: 175,
      heartRate: 72,
      sleep: 7,
    },
    {
      id: 2,
      date: "2026-05-10",
      weight: 69,
      height: 175,
      heartRate: 70,
      sleep: 8,
    },
  ]);

  const [healthOpen, setHealthOpen] = useState(false);
  const [editingHealth, setEditingHealth] = useState<any>(null);
  const [healthForm] = Form.useForm();

  const openHealthModal = (record?: any) => {
    if (record) {
      setEditingHealth(record);
      healthForm.setFieldsValue({
        ...record,
        date: dayjs(record.date),
      });
    } else {
      setEditingHealth(null);
      healthForm.resetFields();
    }

    setHealthOpen(true);
  };

  const saveHealth = () => {
    healthForm.validateFields().then((values) => {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editingHealth) {
        setHealthData((prev) =>
          prev.map((h) =>
            h.id === editingHealth.id
              ? { ...editingHealth, ...payload }
              : h
          )
        );
      } else {
        setHealthData((prev) => [
          ...prev,
          { id: Date.now(), ...payload },
        ]);
      }

      setHealthOpen(false);
    });
  };

  // =========================
  // GOALS
  // =========================

  const [goals, setGoals] = useState<any[]>([
    {
      id: 1,
      name: "Giảm cân",
      type: "Giảm cân",
      target: 65,
      current: 69,
      deadline: "2026-08-01",
      status: "Đang thực hiện",
    },
    {
      id: 2,
      name: "Chạy 5km",
      type: "Cải thiện sức bền",
      target: 5,
      current: 5,
      deadline: "2026-06-01",
      status: "Đã đạt",
    },
  ]);

  const [goalDrawer, setGoalDrawer] = useState(false);
  const [goalFilter, setGoalFilter] = useState("Tất cả");
  const [goalForm] = Form.useForm();

  const addGoal = () => {
    goalForm.validateFields().then((values) => {
      setGoals((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...values,
          current: 0,
          deadline: values.deadline.format("YYYY-MM-DD"),
        },
      ]);

      setGoalDrawer(false);
      goalForm.resetFields();
    });
  };

  const filteredGoals =
    goalFilter === "Tất cả"
      ? goals
      : goals.filter((g) => g.status === goalFilter);

  // =========================
  // EXERCISES
  // =========================

  const [exercises, setExercises] = useState<any[]>([
    {
      id: 1,
      name: "Push Up",
      muscle: "Chest",
      difficulty: "Dễ",
      description: "Classic push up",
      calories: 350,
      detail: "Keep your back straight and lower slowly.",
    },
    {
      id: 2,
      name: "Squat",
      muscle: "Legs",
      difficulty: "Trung bình",
      description: "Leg strengthening",
      calories: 500,
      detail: "Push hips backward and keep knees stable.",
    },
  ]);

  const [exerciseModal, setExerciseModal] = useState(false);
  const [exerciseDetail, setExerciseDetail] = useState<any>(null);
  const [exerciseFormOpen, setExerciseFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [exerciseMuscle, setExerciseMuscle] = useState("");
  const [exerciseDifficulty, setExerciseDifficulty] = useState("");

  const [exerciseForm] = Form.useForm();

  const filteredExercises = exercises.filter((e) => {
    const s = e.name
      .toLowerCase()
      .includes(exerciseSearch.toLowerCase());

    const m = exerciseMuscle
      ? e.muscle === exerciseMuscle
      : true;

    const d = exerciseDifficulty
      ? e.difficulty === exerciseDifficulty
      : true;

    return s && m && d;
  });

  // =========================
  // DASHBOARD STATS
  // =========================

  const totalWorkouts = workouts.length;

  const totalCalories = workouts.reduce(
    (sum, w) => sum + w.calories,
    0
  );

  const streak = 8;

  const goalPercent = useMemo(() => {
    if (!goals.length) return 0;

    const avg =
      goals.reduce(
        (sum, g) => sum + (g.current / g.target) * 100,
        0
      ) / goals.length;

    return Math.round(avg);
  }, [goals]);

  const weightChart = healthData.map((h) => ({
    date: h.date,
    weight: h.weight,
  }));

  const weekData = [
    { week: "Tuần 1", value: 3 },
    { week: "Tuần 2", value: 5 },
    { week: "Tuần 3", value: 4 },
    { week: "Tuần 4", value: 6 },
  ];

  // =========================
  // TABLES
  // =========================

  const workoutColumns: any = [
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Loại",
      dataIndex: "type",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      render: (v: number) => `${v} phút`,
    },
    {
      title: "Calo",
      dataIndex: "calories",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v: string) => (
        <Tag color={v === "Hoàn thành" ? "green" : "red"}>
          {v}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => openWorkoutModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa buổi tập?"
            onConfirm={() =>
              setWorkouts((prev) =>
                prev.filter((w) => w.id !== record.id)
              )
            }
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const healthColumns: any = [
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      render: (v: number) => `${v} kg`,
    },
    {
      title: "Chiều cao",
      dataIndex: "height",
      render: (v: number) => `${v} cm`,
    },
    {
      title: "BMI",
      render: (_: any, record: any) => {
        const bmi = (
          record.weight /
          Math.pow(record.height / 100, 2)
        ).toFixed(1);

        const tag = bmiTag(Number(bmi));

        return (
          <Space>
            <span>{bmi}</span>
            <Tag color={tag.color}>{tag.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: "Nhịp tim",
      dataIndex: "heartRate",
      render: (v: number) => `${v} bpm`,
    },
    {
      title: "Giờ ngủ",
      dataIndex: "sleep",
      render: (v: number) => `${v} giờ`,
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => openHealthModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa dữ liệu?"
            onConfirm={() =>
              setHealthData((prev) =>
                prev.filter((h) => h.id !== record.id)
              )
            }
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // =========================
  // RENDER
  // =========================

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Sider theme="light">
        <div
          style={{
            color: "#000",
            fontSize: 22,
            fontWeight: 700,
            padding: 20,
          }}
        >
          FitTracker
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[page]}
          onClick={(e) => setPage(e.key)}
          items={[
            {
              key: "dashboard",
              label: "Dashboard",
            },
            {
              key: "workouts",
              label: "Nhật ký tập luyện",
            },
            {
              key: "health",
              label: "Chỉ số sức khỏe",
            },
            {
              key: "goals",
              label: "Mục tiêu",
            },
            {
              key: "exercises",
              label: "Thư viện bài tập",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Ứng dụng theo dõi sức khỏe & thể dục
        </Header>

        <Content style={{ padding: 24 }}>
          {/* DASHBOARD */}
          {page === "dashboard" && (
            <>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Tổng buổi tập"
                      value={totalWorkouts}
                    />
                  </Card>
                </Col>

                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Calo đã đốt"
                      value={totalCalories}
                    />
                  </Card>
                </Col>

                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Streak"
                      value={streak}
                    />
                  </Card>
                </Col>

                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Mục tiêu hoàn thành"
                      value={goalPercent}
                      suffix="%"
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={12}>
                  <Card title="Số buổi tập theo tuần">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weekData}>
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#ff4d4f" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card title="Biến động cân nặng">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weightChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#ff4d4f"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              <Card
                title="5 buổi tập gần nhất"
                style={{ marginTop: 20 }}
              >
                <Timeline
                  items={workouts.slice(-5).map((w) => ({
                    children: `${w.date} - ${w.type} - ${w.duration} phút`,
                  }))}
                />
              </Card>
            </>
          )}

          {/* WORKOUTS */}
          {page === "workouts" && (
            <>
              <Card>
                <Row gutter={16}>
                  <Col span={8}>
                    <Input
                      placeholder="Tìm theo tên bài tập"
                      value={workoutSearch}
                      onChange={(e) =>
                        setWorkoutSearch(e.target.value)
                      }
                    />
                  </Col>

                  <Col span={5}>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Loại bài tập"
                      allowClear
                      onChange={(v) =>
                        setWorkoutFilterType(v || "")
                      }
                      options={workoutTypes.map((x) => ({
                        label: x,
                        value: x,
                      }))}
                    />
                  </Col>

                  <Col span={7}>
                    <RangePicker
                      style={{ width: "100%" }}
                      onChange={(v) => setWorkoutRange(v)}
                    />
                  </Col>

                  <Col span={4}>
                    <Button
                      type="primary"
                      onClick={() => openWorkoutModal()}
                      block
                    >
                      Thêm
                    </Button>
                  </Col>
                </Row>
              </Card>

              <Table
                rowKey="id"
                columns={workoutColumns}
                dataSource={filteredWorkouts}
                style={{ marginTop: 20 }}
              />

              <Modal
                title={
                  editingWorkout
                    ? "Sửa buổi tập"
                    : "Thêm buổi tập"
                }
                open={workoutOpen}
                onCancel={() => setWorkoutOpen(false)}
                onOk={saveWorkout}
              >
                <Form layout="vertical" form={workoutForm}>
                  <Form.Item
                    label="Ngày tập"
                    name="date"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Loại bài tập"
                    name="type"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={workoutTypes.map((x) => ({
                        label: x,
                        value: x,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Thời lượng"
                    name="duration"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Calo"
                    name="calories"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item label="Ghi chú" name="note">
                    <TextArea />
                  </Form.Item>

                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        {
                          label: "Hoàn thành",
                          value: "Hoàn thành",
                        },
                        {
                          label: "Bỏ lỡ",
                          value: "Bỏ lỡ",
                        },
                      ]}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}

          {/* HEALTH */}
          {page === "health" && (
            <>
              <Button
                type="primary"
                onClick={() => openHealthModal()}
                style={{ marginBottom: 20 }}
              >
                Thêm chỉ số
              </Button>

              <Table
                rowKey="id"
                columns={healthColumns}
                dataSource={healthData}
              />

              <Modal
                title="Chỉ số sức khỏe"
                open={healthOpen}
                onCancel={() => setHealthOpen(false)}
                onOk={saveHealth}
              >
                <Form layout="vertical" form={healthForm}>
                  <Form.Item
                    label="Ngày"
                    name="date"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Cân nặng"
                    name="weight"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Chiều cao"
                    name="height"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Nhịp tim"
                    name="heartRate"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item label="Giờ ngủ" name="sleep">
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}

          {/* GOALS */}
          {page === "goals" && (
            <>
              <Row
                justify="space-between"
                style={{ marginBottom: 20 }}
              >
                <Segmented
                  options={[
                    "Tất cả",
                    "Đang thực hiện",
                    "Đã đạt",
                    "Đã hủy",
                  ]}
                  value={goalFilter}
                  onChange={(v) => setGoalFilter(v as string)}
                />

                <Button
                  type="primary"
                  onClick={() => setGoalDrawer(true)}
                >
                  Thêm mục tiêu
                </Button>
              </Row>

              <Row gutter={[16, 16]}>
                {filteredGoals.map((g) => {
                  const percent = Math.min(
                    Math.round((g.current / g.target) * 100),
                    100
                  );

                  return (
                    <Col span={8} key={g.id}>
                      <Card
                        title={g.name}
                        extra={
                          <Popconfirm
                            title="Xóa mục tiêu?"
                            onConfirm={() =>
                              setGoals((prev) =>
                                prev.filter(
                                  (x) => x.id !== g.id
                                )
                              )
                            }
                          >
                            <Button
                              danger
                            >
                              Xóa
                            </Button>
                          </Popconfirm>
                        }
                      >
                        <p>
                          <b>Loại:</b> {g.type}
                        </p>

                        <p>
                          <b>Mục tiêu:</b> {g.target}
                        </p>

                        <Space>
                          <b>Hiện tại:</b>

                          <InputNumber
                            value={g.current}
                            onChange={(v) =>
                              setGoals((prev) =>
                                prev.map((x) =>
                                  x.id === g.id
                                    ? {
                                        ...x,
                                        current: Number(v),
                                      }
                                    : x
                                )
                              )
                            }
                          />
                        </Space>

                        <div style={{ marginTop: 16 }}>
                          <Progress percent={percent} />
                        </div>

                        <p>
                          <b>Deadline:</b> {g.deadline}
                        </p>

                        <Tag color="blue">{g.status}</Tag>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <Drawer
                title="Thêm mục tiêu"
                open={goalDrawer}
                onClose={() => setGoalDrawer(false)}
              >
                <Form layout="vertical" form={goalForm}>
                  <Form.Item
                    label="Tên mục tiêu"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Loại"
                    name="type"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        "Giảm cân",
                        "Tăng cơ",
                        "Cải thiện sức bền",
                        "Khác",
                      ].map((x) => ({
                        label: x,
                        value: x,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Giá trị mục tiêu"
                    name="target"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Deadline"
                    name="deadline"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        "Đang thực hiện",
                        "Đã đạt",
                        "Đã hủy",
                      ].map((x) => ({
                        label: x,
                        value: x,
                      }))}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    block
                    onClick={addGoal}
                  >
                    Lưu mục tiêu
                  </Button>
                </Form>
              </Drawer>
            </>
          )}

          {/* EXERCISES */}
          {page === "exercises" && (
            <>
              <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={8}>
                  <Input
                    placeholder="Tìm kiếm bài tập"
                    value={exerciseSearch}
                    onChange={(e) =>
                      setExerciseSearch(e.target.value)
                    }
                  />
                </Col>

                <Col span={5}>
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Nhóm cơ"
                    onChange={(v) =>
                      setExerciseMuscle(v || "")
                    }
                    options={muscleGroups.map((x) => ({
                      label: x,
                      value: x,
                    }))}
                  />
                </Col>

                <Col span={5}>
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Độ khó"
                    onChange={(v) =>
                      setExerciseDifficulty(v || "")
                    }
                    options={["Dễ", "Trung bình", "Khó"].map(
                      (x) => ({
                        label: x,
                        value: x,
                      })
                    )}
                  />
                </Col>

                <Col span={6}>
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      setEditingExercise(null);
                      exerciseForm.resetFields();
                      setExerciseFormOpen(true);
                    }}
                  >
                    Thêm bài tập
                  </Button>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                {filteredExercises.map((e) => (
                  <Col span={8} key={e.id}>
                    <Card
                      hoverable
                      title={e.name}
                      onClick={() => {
                        setExerciseDetail(e);
                        setExerciseModal(true);
                      }}
                      extra={
                        <Space
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          <Button
                            onClick={() => {
                              setEditingExercise(e);
                              exerciseForm.setFieldsValue(e);
                              setExerciseFormOpen(true);
                            }}
                          >
                            Sửa
                          </Button>

                          <Popconfirm
                            title="Xóa bài tập?"
                            onConfirm={() =>
                              setExercises((prev) =>
                                prev.filter(
                                  (x) => x.id !== e.id
                                )
                              )
                            }
                          >
                            <Button
                              danger
                            >
                              Xóa
                            </Button>
                          </Popconfirm>
                        </Space>
                      }
                    >
                      <p>
                        <b>Nhóm cơ:</b> {e.muscle}
                      </p>

                      <Tag
                        color={
                          difficultyColors[e.difficulty]
                        }
                      >
                        {e.difficulty}
                      </Tag>

                      <p style={{ marginTop: 12 }}>
                        {e.description}
                      </p>

                      <p>
                        <b>Calo/giờ:</b> {e.calories}
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Modal
                title={exerciseDetail?.name}
                open={exerciseModal}
                footer={null}
                onCancel={() => setExerciseModal(false)}
              >
                <p>
                  <b>Nhóm cơ:</b> {exerciseDetail?.muscle}
                </p>

                <p>
                  <b>Độ khó:</b>{" "}
                  {exerciseDetail?.difficulty}
                </p>

                <p>
                  <b>Mô tả:</b>{" "}
                  {exerciseDetail?.detail}
                </p>

                <p>
                  <b>Calo/giờ:</b>{" "}
                  {exerciseDetail?.calories}
                </p>
              </Modal>

              <Modal
                title={
                  editingExercise
                    ? "Sửa bài tập"
                    : "Thêm bài tập"
                }
                open={exerciseFormOpen}
                onCancel={() => setExerciseFormOpen(false)}
                onOk={() => {
                  exerciseForm
                    .validateFields()
                    .then((values) => {
                      if (editingExercise) {
                        setExercises((prev) =>
                          prev.map((x) =>
                            x.id === editingExercise.id
                              ? {
                                  ...editingExercise,
                                  ...values,
                                }
                              : x
                          )
                        );
                      } else {
                        setExercises((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            ...values,
                          },
                        ]);
                      }

                      setExerciseFormOpen(false);
                    });
                }}
              >
                <Form layout="vertical" form={exerciseForm}>
                  <Form.Item
                    label="Tên bài tập"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Nhóm cơ"
                    name="muscle"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={muscleGroups.map((x) => ({
                        label: x,
                        value: x,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Độ khó"
                    name="difficulty"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        "Dễ",
                        "Trung bình",
                        "Khó",
                      ].map((x) => ({
                        label: x,
                        value: x,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả ngắn"
                    name="description"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Chi tiết"
                    name="detail"
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    label="Calo đốt / giờ"
                    name="calories"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}