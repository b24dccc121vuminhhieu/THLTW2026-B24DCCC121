import { useState } from "react";
import ReactDOM from "react-dom";
import {
  Layout,
  Menu,
  Card,
  Rate,
  Select,
  Row,
  Col,
  Button,
  List,
  InputNumber,
  Alert,
  Table,
  Form,
  Input,
  Modal,
  Space,
  Statistic,
  Divider,
  Tag,
  Empty,
  Progress
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Option } = Select;

const initialDestinations = [
  {
    id: 1,
    name: "Đà Nẵng",
    type: "beach",
    price: 2000000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    description: "Thành phố biển xinh đẹp với bãi cát trắng",
    visitingTime: 3,
    cost: { food: 500000, hotel: 1000000, transport: 500000 }
  },
  {
    id: 2,
    name: "Sapa",
    type: "mountain",
    price: 1500000,
    rating: 5,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Thị trấn núi hùng vĩ với cảnh tượng tuyệt đẹp",
    visitingTime: 2,
    cost: { food: 400000, hotel: 700000, transport: 400000 }
  },
  {
    id: 3,
    name: "Hà Nội",
    type: "city",
    price: 1200000,
    rating: 4,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
    description: "Thủ đô với lịch sử và văn hóa sâu sắc",
    visitingTime: 2,
    cost: { food: 300000, hotel: 600000, transport: 300000 }
  },
  {
    id: 4,
    name: "Hạ Long",
    type: "beach",
    price: 1800000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    description: "Vịnh Hạ Long - Di sản thế giới",
    visitingTime: 2,
    cost: { food: 450000, hotel: 900000, transport: 450000 }
  },
  {
    id: 5,
    name: "Hội An",
    type: "city",
    price: 1300000,
    rating: 4.6,
    image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/hinh_nen_ipad_dep_0_305a5b4a24.jpg",
    description: "Phố cổ được bảo tồn với kiến trúc độc đáo",
    visitingTime: 2,
    cost: { food: 350000, hotel: 650000, transport: 300000 }
  }
];

const App = () => {
  const [page, setPage] = useState("home");
  const [destinations, setDestinations] = useState(initialDestinations);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("rating");
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [budget, setBudget] = useState(5000000);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filtered = destinations
    .filter((d) => (type ? d.type === type : true))
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  const onAddDestination = (values: any) => {
    if (editingId) {
      setDestinations(
        destinations.map((d) => (d.id === editingId ? { ...values, id: editingId } : d))
      );
      setEditingId(null);
    } else {
      const newItem = { 
        ...values, 
        id: Math.max(...destinations.map((d) => d.id), 0) + 1,
        rating: values.rating || 4
      };
      setDestinations([...destinations, newItem]);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const deleteDestination = (id: number) => {
    setDestinations(destinations.filter((d) => d.id !== id));
  };

  const editDestination = (destination: any) => {
    setEditingId(destination.id);
    form.setFieldsValue(destination);
    setIsModalVisible(true);
  };

  const addToPlan = (place: any) => {
    const day = Math.ceil(itinerary.length / 3) + 1;
    setItinerary([...itinerary, { ...place, day, tripDuration: place.visitingTime }]);
  };

  const removeFromPlan = (id: number) => {
    setItinerary(itinerary.filter((i) => i.id !== id));
  };

  const totalCost = itinerary.reduce(
    (sum, p) => sum + p.cost.food + p.cost.hotel + p.cost.transport,
    0
  );

  const foodCost = itinerary.reduce((s, p) => s + p.cost.food, 0);
  const hotelCost = itinerary.reduce((s, p) => s + p.cost.hotel, 0);
  const transportCost = itinerary.reduce((s, p) => s + p.cost.transport, 0);
  const budgetRemaining = budget - totalCost;
  const budgetUsedPercent = Math.round((totalCost / budget) * 100);

  const popularDestinations = destinations
    .map((d) => ({
      name: d.name,
      count: itinerary.filter((i) => i.id === d.id).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalTripDays = Math.max(...itinerary.map((i) => i.day || 1), 0);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header style={{ background: "#FF4444" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={(e) => setPage(e.key as string)}
          selectedKeys={[page]}
          style={{ background: "#FF4444" }}
          items={[
            { key: "home", label: "Khám Phá" },
            { key: "planner", label: "Lịch Trình" },
            { key: "budget", label: "Ngân Sách" },
            { key: "admin", label: "Quản Lý" }
          ]}
        />
      </Header>

      <Content style={{ padding: "20px" }}>
        {page === "home" && (
          <>
            <h1>Khám Phá Điểm Đến</h1>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col xs={12} sm={8} md={6}>
                <Select 
                  placeholder="Loại hình" 
                  onChange={setType} 
                  allowClear
                  className="w-full"
                >
                  <Option value="">Tất cả</Option>
                  <Option value="beach">Biển</Option>
                  <Option value="mountain">Núi</Option>
                  <Option value="city">Thành phố</Option>
                </Select>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Select 
                  defaultValue="rating"
                  onChange={setSort} 
                  className="w-full"
                >
                  <Option value="rating">Đánh giá cao</Option>
                  <Option value="price">Giá thấp</Option>
                </Select>
              </Col>
            </Row>

            {filtered.length === 0 ? (
              <Empty description="Không tìm thấy điểm đến" />
            ) : (
              <Row gutter={[16, 16]}>
                {filtered.map((item) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card 
                      hoverable
                      cover={
                        <div style={{ height: 200, overflow: "hidden", backgroundColor: "#f0f0f0" }}>
                          <img 
                            src={item.image} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                            alt={item.name}
                          />
                        </div>
                      }
                    >
                      <h3>{item.name}</h3>
                      <Rate disabled value={item.rating} /> ({item.rating}/5)
                      <p style={{ marginTop: 8 }}>{item.description}</p>
                      <Divider style={{ margin: "8px 0" }} />
                      <Row justify="space-between">
                        <span>{(item.price / 1000000).toFixed(1)}M</span>
                        <span>{item.visitingTime} ngày</span>
                      </Row>
                      <Button 
                        type="primary" 
                        block 
                        style={{ marginTop: 10 }}
                        onClick={() => addToPlan(item)}
                      >
                        Thêm vào lịch trình
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}

        {page === "planner" && (
          <>
            <h1>Lịch Trình Du Lịch</h1>

            {itinerary.length === 0 ? (
              <Empty description="Chưa có điểm đến nào. Hãy thêm từ trang Khám Phá!" />
            ) : (
              <>
                <Alert
                  message={`Tổng ${itinerary.length} điểm đến - ${totalTripDays} ngày${totalTripDays > 0 ? "" : ""}`}
                  type="info"
                  style={{ marginBottom: 20 }}
                />

                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                  <Col xs={12} sm={6}>
                    <Statistic 
                      title="Tổng ngày" 
                      value={totalTripDays} 
                      suffix="ngày"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic 
                      title="Tổng chi phí" 
                      value={totalCost} 
                      suffix="đ"
                      valueStyle={{ color: totalCost > budget ? "red" : "green", fontSize: 18 }}
                    />
                  </Col>
                </Row>

                <List
                  dataSource={itinerary}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button 
                          danger 
                          size="small"
                          onClick={() => removeFromPlan(item.id)}
                        >
                          Xóa
                        </Button>
                      ]}
                      style={{ padding: "12px", marginBottom: 8, backgroundColor: "#fafafa", borderRadius: 4 }}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={
                          <>
                            <p>Mô tả: {item.description}</p>
                            <p>{item.visitingTime} ngày | {(item.price / 1000000).toFixed(1)}M VND</p>
                            <p>Ăn: {(item.cost.food / 1000).toFixed(0)}k | Hotel: {(item.cost.hotel / 1000).toFixed(0)}k | Xe: {(item.cost.transport / 1000).toFixed(0)}k</p>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </>
            )}
          </>
        )}

        {page === "budget" && (
          <>
            <h1>Quản Lý Ngân Sách</h1>

            <Card style={{ marginBottom: 20 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <label>Ngân sách dự kiến:</label>
                  <InputNumber 
                    value={budget}
                    onChange={(v) => setBudget(v || 0)}
                    style={{ width: "100%", marginTop: 8 }}
                    min={0}
                    step={100000}
                    formatter={(value) => value ? `${(value / 1000000).toFixed(1)}M` : ""}
                    parser={(value: string | undefined) => value ? parseInt(value.replace("M", "")) * 1000000 : 0}
                  />
                </div>
              </Space>
            </Card>

            {itinerary.length === 0 ? (
              <Empty description="Chưa có chi phí. Thêm điểm đến vào lịch trình!" />
            ) : (
              <>
                {totalCost > budget && (
                  <Alert 
                    type="error" 
                    message={`Vượt ngân sách ${((totalCost - budget) / 1000000).toFixed(1)}M VND!`}
                    showIcon
                    style={{ marginBottom: 20 }}
                  />
                )}

                {totalCost <= budget && (
                  <Alert 
                    type="success" 
                    message={`Còn lại ${((budget - totalCost) / 1000000).toFixed(1)}M VND`}
                    showIcon
                    style={{ marginBottom: 20 }}
                  />
                )}

                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic 
                        title="Ngân sách" 
                        value={budget / 1000000} 
                        suffix="M"
                        valueStyle={{ color: "#FF4444" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic 
                        title="Đã chi" 
                        value={totalCost / 1000000} 
                        suffix="M"
                        valueStyle={{ color: totalCost > budget ? "red" : "green" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic 
                        title="Còn lại" 
                        value={budgetRemaining / 1000000} 
                        suffix="M"
                        valueStyle={{ color: budgetRemaining < 0 ? "red" : "green" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic 
                        title="Sử dụng" 
                        value={budgetUsedPercent} 
                        suffix="%"
                      />
                    </Card>
                  </Col>
                </Row>

                <Card title="📊 Chi tiết theo hạng mục">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Card>
                        <Statistic 
                          title="Ăn uống" 
                          value={foodCost / 1000000} 
                          suffix="M"
                        />
                        <Progress 
                          percent={Math.round((foodCost / totalCost) * 100)} 
                          status={Math.round((foodCost / totalCost) * 100) > 40 ? "exception" : "active"}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card>
                        <Statistic 
                          title="Lưu trú" 
                          value={hotelCost / 1000000} 
                          suffix="M"
                        />
                        <Progress 
                          percent={Math.round((hotelCost / totalCost) * 100)} 
                          status={Math.round((hotelCost / totalCost) * 100) > 50 ? "exception" : "active"}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card>
                        <Statistic 
                          title="Di chuyển" 
                          value={transportCost / 1000000} 
                          suffix="M"
                        />
                        <Progress 
                          percent={Math.round((transportCost / totalCost) * 100)} 
                          status={Math.round((transportCost / totalCost) * 100) > 30 ? "exception" : "active"}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Divider />

                  <List
                    dataSource={itinerary}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.name}
                          description={
                            <>
                              {(item.cost.food / 1000000).toFixed(1)}M | 
                              {(item.cost.hotel / 1000000).toFixed(1)}M | 
                              {(item.cost.transport / 1000000).toFixed(1)}M
                            </>
                          }
                        />
                        <span>{((item.cost.food + item.cost.hotel + item.cost.transport) / 1000000).toFixed(1)}M</span>
                      </List.Item>
                    )}
                  />
                </Card>
              </>
            )}
          </>
        )}

        {page === "admin" && (
          <>
            <h1>Quản Lý Điểm Đến</h1>

            <Card style={{ marginBottom: 20 }}>
              <Button 
                type="primary" 
                onClick={() => {
                  setEditingId(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Thêm điểm đến mới
              </Button>
            </Card>

            <Table
              dataSource={destinations}
              size="small"
              scroll={{ x: 800 }}
              columns={[
                { 
                  title: "Tên", 
                  dataIndex: "name",
                  width: 150
                },
                { 
                  title: "Loại", 
                  dataIndex: "type",
                  render: (type) => {
                    const colors: any = { beach: "blue", mountain: "green", city: "red" };
                    return <Tag color={colors[type]}>{type}</Tag>;
                  },
                  width: 100
                },
                { 
                  title: "Giá", 
                  dataIndex: "price",
                  render: (price) => `${(price / 1000000).toFixed(1)}M`,
                  width: 100
                },
                { 
                  title: "Rating", 
                  dataIndex: "rating",
                  render: (rating) => <Rate disabled value={rating} />,
                  width: 150
                },
                {
                  title: "Thao tác",
                  width: 120,
                  render: (_, record) => (
                    <Space>
                      <Button 
                        type="primary" 
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => editDestination(record)}
                      />
                      <Button 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          Modal.confirm({
                            title: "Xác nhận xóa",
                            content: `Bạn có chắc muốn xóa "${record.name}"?`,
                            okText: "Xóa",
                            cancelText: "Hủy",
                            okButtonProps: { danger: true },
                            onOk: () => deleteDestination(record.id)
                          });
                        }}
                      />
                    </Space>
                  )
                }
              ]}
              rowKey="id"
            />

            <Divider />

            <h2>Thống kê</h2>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Tổng điểm đến" 
                    value={destinations.length}
                    valueStyle={{ color: "#FF4444" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Lịch trình tạo" 
                    value={itinerary.length}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Tổng doanh thu" 
                    value={totalCost / 1000000} 
                    suffix="M"
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Điểm phổ biến" 
                    value={popularDestinations[0]?.name || "N/A"}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Top 5 Điểm Đến Phổ Biến" style={{ marginTop: 20 }}>
              <List
                dataSource={popularDestinations}
                renderItem={(item, idx) => (
                  <List.Item>
                    <span>{idx + 1}. {item.name}</span>
                    <Tag color="blue">{item.count} lần</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}
      </Content>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingId ? "Sửa điểm đến" : "Thêm điểm đến mới"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingId(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onAddDestination}>
          <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Mô tả chi tiết" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại hình">
                  <Option value="beach">🏖️ Biển</Option>
                  <Option value="mountain">⛰️ Núi</Option>
                  <Option value="city">🏙️ Thành phố</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="visitingTime" label="Thời gian tham quan (ngày)" rules={[{ required: true }]}>
                <InputNumber min={1} placeholder="Số ngày" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="price" label="Giá (VND)" rules={[{ required: true }]}>
                <InputNumber min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="rating" label="Đánh giá (0-5)">
                <InputNumber min={0} max={5} step={0.5} placeholder="4" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Chi phí chi tiết">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item name={["cost", "food"]} label="Ăn uống (VND)" rules={[{ required: true }]}>
                  <InputNumber min={0} placeholder="0" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name={["cost", "hotel"]} label="Lưu trú (VND)" rules={[{ required: true }]}>
                  <InputNumber min={0} placeholder="0" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name={["cost", "transport"]} label="Di chuyển (VND)" rules={[{ required: true }]}>
                  <InputNumber min={0} placeholder="0" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="image" label="Ảnh đại diện" rules={[{ required: true }]}>
            <Input placeholder="https://via.placeholder.com/300x200" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));