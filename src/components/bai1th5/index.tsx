import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Tag,
  Space,
  Card,
  Tabs,
  Form,
  Select,
  DatePicker,
  Checkbox,
  Row,
  Col,
  message,
  Popconfirm,
  Drawer,
} from "antd";
import dayjs from "dayjs";

type HistoryRecord = {
  action: "Duyệt" | "Từ chối" | "Tạo" | "Cập nhật" | "Chuyển";
  time: string;
  adminName?: string;
  note?: string;
  fromClub?: string;
  toClub?: string;
};

type Club = {
  id: number;
  name: string;
  foundedDate: string;
  description: string;
  leader: string;
  active: boolean;
};

type Application = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "Nam" | "Nữ" | "Khác";
  address: string;
  specialty: string;
  clubId: number;
  reason: string;
  status: "Chờ duyệt" | "Duyệt" | "Từ chối";
  rejectReason?: string;
  history: HistoryRecord[];
};

const INITIAL_CLUBS: Club[] = [
  {
    id: 1,
    name: "CLB Công nghệ",
    foundedDate: "2026-04-01",
    description: "Dành cho những người yêu thích công nghệ và lập trình",
    leader: "Nguyễn Văn A",
    active: true,
  },
  {
    id: 2,
    name: "CLB Âm nhạc",
    foundedDate: "2026-04-01",
    description: "Dành cho những người yêu music và biểu diễn",
    leader: "Trần Thị B",
    active: true,
  },
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 1,
    name: "Nguyễn Văn C",
    email: "c@gmail.com",
    phone: "0123456789",
    gender: "Nam",
    address: "Hà Nội",
    specialty: "Phát triển Web",
    clubId: 1,
    reason: "Muốn nâng cao kỹ năng lập trình",
    status: "Chờ duyệt",
    history: [],
  },
  {
    id: 2,
    name: "Phạm Thị D",
    email: "d@gmail.com",
    phone: "0987654321",
    gender: "Nữ",
    address: "TP Hồ Chí Minh",
    specialty: "Nhảy",
    clubId: 2,
    reason: "Yêu thích âm nhạc và muốn biểu diễn",
    status: "Chờ duyệt",
    history: [],
  },
];

export default function ClubManagementApp() {
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [selectedApps, setSelectedApps] = useState<Application[]>([]);

  const [clubModal, setClubModal] = useState(false);
  const [editClub, setEditClub] = useState<Club | null>(null);
  const [clubForm] = Form.useForm();

  const [appModal, setAppModal] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [appForm] = Form.useForm();

  const [bulkRejectModal, setBulkRejectModal] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState("");

  const [transferModal, setTransferModal] = useState(false);
  const [transferClubId, setTransferClubId] = useState<number | null>(null);

  const [detailsDrawer, setDetailsDrawer] = useState(false);
  const [detailsApp, setDetailsApp] = useState<Application | null>(null);

  const [membersDrawer, setMembersDrawer] = useState(false);
  const [membersClubId, setMembersClubId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("1");

  const showClubForm = (club?: Club) => {
    if (club) {
      setEditClub(club);
      clubForm.setFieldsValue({
        ...club,
        foundedDate: dayjs(club.foundedDate),
      });
    } else {
      setEditClub(null);
      clubForm.resetFields();
    }
    setClubModal(true);
  };

  const handleSaveClub = async () => {
    try {
      const values = await clubForm.validateFields();
      const newClub: Club = {
        ...values,
        foundedDate: values.foundedDate.format("YYYY-MM-DD"),
        id: editClub?.id || Math.max(0, ...clubs.map((c) => c.id)) + 1,
      };

      if (editClub) {
        setClubs(clubs.map((c) => (c.id === editClub.id ? newClub : c)));
      } else {
        setClubs([...clubs, newClub]);
      }
      setClubModal(false);
      message.success(editClub ? "Cập nhật thành công!" : "Tạo thành công!");
    } catch (error) {
      message.error("Vui lòng điền đầy đủ các trường");
    }
  };

  const handleDeleteClub = (id: number) => {
    setClubs(clubs.filter((c) => c.id !== id));
    message.success("Xóa thành công!");
  };

  const showAppForm = (app?: Application) => {
    if (app) {
      setEditApp(app);
      appForm.setFieldsValue(app);
    } else {
      setEditApp(null);
      appForm.resetFields();
    }
    setAppModal(true);
  };

  const handleSaveApp = async () => {
    try {
      const values = await appForm.validateFields();
      const newApp: Application = {
        ...values,
        id: editApp?.id || Math.max(0, ...applications.map((a) => a.id)) + 1,
        history: editApp?.history || [],
      };

      if (editApp) {
        setApplications(applications.map((a) => (a.id === editApp.id ? newApp : a)));
      } else {
        setApplications([...applications, newApp]);
      }
      setAppModal(false);
      message.success(editApp ? "Cập nhật thành công!" : "Tạo thành công!");
    } catch (error) {
      message.error("Vui lòng điền đầy đủ các trường");
    }
  };

  const handleDeleteApp = (id: number) => {
    setApplications(applications.filter((a) => a.id !== id));
    message.success("Xóa thành công!");
  };

  const approveOne = (app: Application) => {
    const updated: Application = {
      ...app,
      status: "Duyệt",
      history: [
        ...app.history,
        {
          action: "Duyệt",
          time: new Date().toLocaleString("vi-VN"),
          adminName: "Admin",
        },
      ],
    };
    setApplications(applications.map((a) => (a.id === app.id ? updated : a)));
    message.success("Duyệt thành công!");
  };

  const rejectOne = (app: Application, reason: string) => {
    const updated: Application = {
      ...app,
      status: "Từ chối",
      rejectReason: reason,
      history: [
        ...app.history,
        {
          action: "Từ chối",
          time: new Date().toLocaleString("vi-VN"),
          adminName: "Admin",
          note: reason,
        },
      ],
    };
    setApplications(applications.map((a) => (a.id === app.id ? updated : a)));
  };

  const approveMany = () => {
    selectedApps.forEach(approveOne);
    setSelectedApps([]);
    message.success(`Duyệt ${selectedApps.length} đơn thành công!`);
  };

  const rejectMany = () => {
    if (!bulkRejectReason.trim()) {
      message.error("Vui lòng nhập lý do!");
      return;
    }
    selectedApps.forEach((app) => rejectOne(app, bulkRejectReason));
    setSelectedApps([]);
    setBulkRejectModal(false);
    setBulkRejectReason("");
    message.success(`Từ chối ${selectedApps.length} đơn thành công!`);
  };

  const getApprovedMembers = (clubId: number) => {
    return applications.filter((a) => a.clubId === clubId && a.status === "Duyệt");
  };

  const transferMembers = () => {
    if (!transferClubId || selectedApps.length === 0) {
      message.error("Vui lòng chọn CLB và thành viên!");
      return;
    }

    const oldClub = clubs.find((c) => c.id === selectedApps[0].clubId)?.name;
    const newClub = clubs.find((c) => c.id === transferClubId)?.name;

    setApplications(
      applications.map((a) => {
        if (selectedApps.find((s) => s.id === a.id)) {
          return {
            ...a,
            clubId: transferClubId,
            history: [
              ...a.history,
              {
                action: "Chuyển",
                time: new Date().toLocaleString("vi-VN"),
                adminName: "Admin",
                fromClub: oldClub,
                toClub: newClub,
              },
            ],
          };
        }
        return a;
      })
    );

    setSelectedApps([]);
    setTransferModal(false);
    setTransferClubId(null);
    message.success(`Chuyển ${selectedApps.length} thành viên thành công!`);
  };

  const stats = {
    totalClubs: clubs.length,
    pending: applications.filter((a) => a.status === "Chờ duyệt").length,
    approved: applications.filter((a) => a.status === "Duyệt").length,
    rejected: applications.filter((a) => a.status === "Từ chối").length,
  };

  const clubCols = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Ngày thành lập", dataIndex: "foundedDate", key: "foundedDate" },
    { title: "Chủ nhiệm", dataIndex: "leader", key: "leader" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: Club) => (
        <Tag color={record.active ? "green" : "red"}>
          {record.active ? "Hoạt động" : "Ngừng"}
        </Tag>
      ),
    },
    {
      title: "Thành viên",
      key: "members",
      render: (_: any, record: Club) => (
        <Button
          type="link"
          onClick={() => {
            setMembersClubId(record.id);
            setMembersDrawer(true);
          }}
        >
          {getApprovedMembers(record.id).length}
        </Button>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Club) => (
        <Space>
          <Button size="small" onClick={() => showClubForm(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa?" onConfirm={() => handleDeleteClub(record.id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const appCols = [
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Sở trường", dataIndex: "specialty", key: "specialty" },
    {
      title: "CLB",
      key: "club",
      render: (_: any, record: Application) =>
        clubs.find((c) => c.id === record.clubId)?.name || "N/A",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: Application) => {
        const color =
          record.status === "Duyệt"
            ? "green"
            : record.status === "Từ chối"
            ? "red"
            : "gold";
        return <Tag color={color}>{record.status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Application) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => {
              setDetailsApp(record);
              setDetailsDrawer(true);
            }}
          >
            Xem
          </Button>
          <Button size="small" onClick={() => showAppForm(record)}>
            Sửa
          </Button>
          {record.status === "Chờ duyệt" ? (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => approveOne(record)}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                onClick={() => {
                  Modal.confirm({
                    title: "Từ chối",
                    content: (
                      <Input
                        placeholder="Lý do"
                        onChange={(e) => setBulkRejectReason(e.target.value)}
                      />
                    ),
                    onOk: () => {
                      rejectOne(record, bulkRejectReason);
                      setBulkRejectReason("");
                      message.success("Từ chối thành công!");
                    },
                  });
                }}
              >
                Từ chối
              </Button>
            </>
          ) : null}
          <Popconfirm title="Xóa?" onConfirm={() => handleDeleteApp(record.id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const memberCols = [
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Sở trường", dataIndex: "specialty", key: "specialty" },
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 16 }}>Quản lý câu lạc bộ</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#1890ff" }}>
              {stats.totalClubs}
            </div>
            <div>Tổng CLB</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#faad14" }}>
              {stats.pending}
            </div>
            <div>Chờ duyệt</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#52c41a" }}>
              {stats.approved}
            </div>
            <div>Đã duyệt</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#ff4d4f" }}>
              {stats.rejected}
            </div>
            <div>Từ chối</div>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        defaultActiveKey="1"
        type="card"
      >
        <Tabs.TabPane tab="Danh sách CLB" key="1">
          <Card>
            <Button
              type="primary"
              onClick={() => showClubForm()}
              style={{ marginBottom: 16 }}
            >
              Thêm CLB
            </Button>
            <Table
              columns={clubCols}
              dataSource={clubs}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý đơn đăng ký" key="2">
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={() => showAppForm()}
              >
                Thêm mới
              </Button>
              {selectedApps.length > 0 && (
                <>
                  <Button type="primary" onClick={approveMany}>
                    Duyệt ({selectedApps.length})
                  </Button>
                  <Button danger onClick={() => setBulkRejectModal(true)}>
                    Từ chối ({selectedApps.length})
                  </Button>
                </>
              )}
            </Space>
            <Table
              columns={appCols}
              dataSource={applications}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              rowSelection={{
                onChange: (_keys, rows) => setSelectedApps(rows),
                selectedRowKeys: selectedApps.map((a) => a.id),
              }}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý thành viên" key="3">
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <span>Tổng thành viên: {applications.filter((a) => a.status === "Duyệt").length}</span>
              {selectedApps.length > 0 && (
                <Button onClick={() => setTransferModal(true)}>
                  Chuyển CLB ({selectedApps.length})
                </Button>
              )}
            </Space>
            <Table
              columns={memberCols}
              dataSource={applications.filter((a) => a.status === "Duyệt")}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              rowSelection={{
                onChange: (_keys, rows) => setSelectedApps(rows),
                selectedRowKeys: selectedApps.map((a) => a.id),
              }}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Báo cáo thống kê" key="4">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Card title="Thống kê theo CLB">
                <Table
                  columns={[
                    { title: "CLB", dataIndex: "club", key: "club" },
                    { title: "Chờ duyệt", dataIndex: "pending", key: "pending" },
                    { title: "Đã duyệt", dataIndex: "approved", key: "approved" },
                    { title: "Từ chối", dataIndex: "rejected", key: "rejected" },
                  ]}
                  dataSource={clubs.map((club) => {
                    const clubApps = applications.filter((a) => a.clubId === club.id);
                    return {
                      key: club.id,
                      club: club.name,
                      pending: clubApps.filter((a) => a.status === "Chờ duyệt").length,
                      approved: clubApps.filter((a) => a.status === "Duyệt").length,
                      rejected: clubApps.filter((a) => a.status === "Từ chối").length,
                    };
                  })}
                  pagination={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card title="Tóm tắt">
                <div style={{ fontSize: 14, lineHeight: 2.5 }}>
                  <p><strong>Tổng CLB:</strong> {stats.totalClubs}</p>
                  <p><strong>Tổng đơn:</strong> {stats.pending + stats.approved + stats.rejected}</p>
                  <p>
                    <strong>Tỉ lệ duyệt:</strong>{" "}
                    {(
                      (stats.approved / (stats.pending + stats.approved + stats.rejected)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <p><strong>Tổng thành viên:</strong> {stats.approved}</p>
                </div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editClub ? "Sửa CLB" : "Thêm CLB"}
        visible={clubModal}
        onOk={handleSaveClub}
        onCancel={() => setClubModal(false)}
        width={600}
      >
        <Form form={clubForm} layout="vertical">
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="leader" label="Chủ nhiệm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="active" valuePropName="checked">
            <Checkbox>Hoạt động</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editApp ? "Sửa đơn đăng ký" : "Thêm đơn đăng ký"}
        visible={appModal}
        onOk={handleSaveApp}
        onCancel={() => setAppModal(false)}
        width={600}
      >
        <Form form={appForm} layout="vertical">
          <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
            <Select options={[
              { label: "Nam", value: "Nam" },
              { label: "Nữ", value: "Nữ" },
              { label: "Khác", value: "Khác" },
            ]} />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="specialty" label="Sở trường" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="clubId" label="CLB" rules={[{ required: true }]}>
            <Select options={clubs.map((c) => ({ label: c.name, value: c.id }))} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Từ chối đơn đăng ký"
        visible={bulkRejectModal}
        onOk={rejectMany}
        onCancel={() => {
          setBulkRejectModal(false);
          setBulkRejectReason("");
        }}
      >
        <Input.TextArea
          placeholder="Nhập lý do từ chối"
          rows={4}
          value={bulkRejectReason}
          onChange={(e) => setBulkRejectReason(e.target.value)}
        />
      </Modal>

      <Modal
        title={`Chuyển ${selectedApps.length} thành viên`}
        visible={transferModal}
        onOk={transferMembers}
        onCancel={() => {
          setTransferModal(false);
          setTransferClubId(null);
        }}
      >
        <Select
          placeholder="Chọn CLB"
          options={clubs.map((c) => ({ label: c.name, value: c.id }))}
          value={transferClubId}
          onChange={setTransferClubId}
        />
      </Modal>

      <Drawer
        title="Chi tiết đơn đăng ký"
        placement="right"
        onClose={() => setDetailsDrawer(false)}
        visible={detailsDrawer}
        width={500}
      >
        {detailsApp && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p><strong>Họ tên:</strong> {detailsApp.name}</p>
            <p><strong>Email:</strong> {detailsApp.email}</p>
            <p><strong>SĐT:</strong> {detailsApp.phone}</p>
            <p><strong>Giới tính:</strong> {detailsApp.gender}</p>
            <p><strong>Địa chỉ:</strong> {detailsApp.address}</p>
            <p><strong>Sở trường:</strong> {detailsApp.specialty}</p>
            <p>
              <strong>CLB:</strong>{" "}
              {clubs.find((c) => c.id === detailsApp.clubId)?.name}
            </p>
            <p><strong>Lý do:</strong> {detailsApp.reason}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={detailsApp.status === "Duyệt" ? "green" : detailsApp.status === "Từ chối" ? "red" : "gold"}>
                {detailsApp.status}
              </Tag>
            </p>
            {detailsApp.history.length > 0 && (
              <div>
                <strong>Lịch sử:</strong>
                {detailsApp.history.map((h, i) => (
                  <div key={i} style={{ marginTop: 8, padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                    <strong>{h.action}</strong> - {h.time}
                    {h.note && <div>Lý do: {h.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Drawer
        title={`Thành viên - ${clubs.find((c) => c.id === membersClubId)?.name || ""}`}
        placement="right"
        onClose={() => setMembersDrawer(false)}
        visible={membersDrawer}
        width={600}
      >
        <Table
          columns={memberCols}
          dataSource={membersClubId ? getApprovedMembers(membersClubId) : []}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Drawer>
    </div>
  );
}