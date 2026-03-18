import { Card, Input, Button, List, Typography, InputNumber} from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export default function BaiTap02() {

  /* =========================
      1. QUẢN LÝ MÔN HỌC
  ========================= */

  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("");

  const addSubject = () => {
    if (!subjectName) return;

    const newSubject = {
      id: Date.now(),
      name: subjectName
    };

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  /* =========================
      2. QUẢN LÝ TIẾN ĐỘ
  ========================= */

  const [sessions, setSessions] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState<number>(0);

  const addSession = () => {
    const newSession = {
      id: Date.now(),
      content,
      duration
    };

    setSessions([...sessions, newSession]);
    setContent("");
    setDuration(0);
  };

  const deleteSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  /* =========================
      3. MỤC TIÊU THÁNG
  ========================= */

  const [goal, setGoal] = useState<number>();

  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>

      {/* =========================
          PHẦN 1
      ========================= */}

      <Card>
        <Title level={4}>📚 Quản lý môn học</Title>

        <Input
          placeholder="Nhập môn học"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />

        <Button type="primary" block style={{ marginTop: 10 }} onClick={addSubject}>
          Thêm môn học
        </Button>

        <List
          dataSource={subjects}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button danger onClick={() => deleteSubject(item.id)}>
                  Xóa
                </Button>
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
      </Card>


      {/* =========================
          PHẦN 2
      ========================= */}

      <Card style={{ marginTop: 20 }}>
        <Title level={4}>📖 Quản lý tiến độ học</Title>

        <Input
          placeholder="Nội dung đã học"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <InputNumber
          placeholder="Thời lượng (giờ)"
          style={{ width: "100%", marginTop: 10 }}
          value={duration}
          onChange={(v) => setDuration(v || 0)}
        />

        <Button type="primary" block style={{ marginTop: 10 }} onClick={addSession}>
          Thêm lịch học
        </Button>

        <List
          dataSource={sessions}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button danger onClick={() => deleteSession(item.id)}>
                  Xóa
                </Button>
              ]}
            >
              {item.content} - {item.duration} giờ
            </List.Item>
          )}
        />
      </Card>


      {/* =========================
          PHẦN 3
      ========================= */}

      <Card style={{ marginTop: 20 }}>
        <Title level={4}>🎯 Mục tiêu học tập tháng</Title>

        <InputNumber
          style={{ width: "100%" }}
          value={goal}
          onChange={(v) => setGoal(v || 0)}
        />

        <div style={{ marginTop: 15 }}>
          <Text>
            Tổng giờ học: {totalTime} / {goal}
          </Text>
        </div>

        <div style={{ marginTop: 10 }}>
          {totalTime >= (goal || 0) ? (
            <Text type="success">✅ Đã đạt mục tiêu</Text>
          ) : (
            <Text type="danger">❌ Chưa đạt mục tiêu</Text>
          )}
        </div>
      </Card>

    </div>
  );
}