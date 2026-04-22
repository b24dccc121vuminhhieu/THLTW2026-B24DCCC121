import { useState } from "react";

// ENUM
const STATUS = {
  PENDING: "Chờ xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Hủy",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

// TYPES
type Customer = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  orderDate: string;
  totalAmount: number;
  status: Status;
};

// MOCK DATA
const customers: Customer[] = [
  { id: "C1", name: "Nguyễn Văn A" },
  { id: "C2", name: "Trần Thị B" },
  { id: "C3", name: "Lê Văn C" },
];

const products: Product[] = [
  { id: "P1", name: "Áo", price: 100 },
  { id: "P2", name: "Quần", price: 200 },
  { id: "P3", name: "Giày", price: 300 },
];

type SortField = "date" | "total";

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    orderId: "",
    customerId: "",
    items: [],
    status: STATUS.PENDING,
  });

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  };

  const handleAddProduct = (productId: string) => {
    if (!productId) return;
    
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existing = form.items.find((item: OrderItem) => item.productId === productId);
    
    if (existing) {
      setForm((prev: any) => ({
        ...prev,
        items: prev.items.map((item: OrderItem) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        items: [
          ...prev.items,
          { productId, quantity: 1, price: product.price },
        ],
      }));
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveProduct(productId);
      return;
    }
    
    setForm((prev: any) => ({
      ...prev,
      items: prev.items.map((item: OrderItem) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setForm((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: OrderItem) => item.productId !== productId),
    }));
  };

  const handleSubmit = () => {
    console.log("Form state:", form);
    console.log("Validation checks:", {
      orderId: form.orderId.trim(),
      customerId: form.customerId,
      itemsLength: form.items.length,
    });

    if (!form.orderId.trim() || !form.customerId || form.items.length === 0) {
      alert("Không được để trống! Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!editingId && orders.some((o) => o.orderId === form.orderId)) {
      alert("Trùng mã đơn! Vui lòng nhập mã khác.");
      return;
    }

    if (editingId) {
      const updatedOrder: Order = {
        orderId: form.orderId,
        customerId: form.customerId,
        items: form.items,
        orderDate: form.orderDate || new Date().toISOString(),
        totalAmount: calculateTotal(form.items),
        status: form.status,
      };
      setOrders((prev) =>
        prev.map((o) => (o.orderId === editingId ? updatedOrder : o))
      );
      setEditingId(null);
    } else {
      const newOrder: Order = {
        ...form,
        orderDate: new Date().toISOString(),
        totalAmount: calculateTotal(form.items),
      };
      setOrders([...orders, newOrder]);
    }

    setForm({ orderId: "", customerId: "", items: [], status: STATUS.PENDING });
  };

  const handleEdit = (orderId: string) => {
    const order = orders.find((o) => o.orderId === orderId);
    if (order) {
      setForm({ ...order });
      setEditingId(orderId);
    }
  };

  const handleCancel = (orderId: string) => {
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return;

    if (order.status !== STATUS.PENDING) {
      alert("Chỉ được hủy khi ở trạng thái chờ xác nhận!");
      return;
    }

    if (confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: STATUS.CANCELLED } : o
        )
      );
    }
  };

  const handleReset = () => {
    setForm({ orderId: "", customerId: "", items: [], status: STATUS.PENDING });
    setEditingId(null);
  };

  let filtered = orders
    .filter((o) =>
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      customers.find((c) => c.id === o.customerId)?.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((o) => (statusFilter ? o.status === statusFilter : true));

  if (sortField === "date") {
    filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  } else if (sortField === "total") {
    filtered.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  return (
    <div style={{ padding: "30px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "32px", 
          fontWeight: "700", 
          background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Quản lý đơn hàng
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>Quản lý và theo dõi tất cả đơn hàng của bạn</p>
      </div>

      <div style={{ 
        backgroundColor: "white",
        padding: "24px", 
        marginBottom: "24px", 
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e8eef3"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: "#333" }}>
          {editingId ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#333" }}>Mã đơn hàng:</label>
            <input
              type="text"
              placeholder="Nhập mã đơn"
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              disabled={!!editingId}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                border: "1px solid #d9e0e9", 
                borderRadius: "8px", 
                fontSize: "14px",
                transition: "all 0.3s",
                outline: "none",
                backgroundColor: editingId ? "#f5f5f5" : "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#e74c3c"}
              onBlur={(e) => e.target.style.borderColor = "#d9e0e9"}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#333" }}>Khách hàng:</label>
            <select
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                border: "1px solid #d9e0e9", 
                borderRadius: "8px", 
                fontSize: "14px",
                transition: "all 0.3s",
                outline: "none",
                backgroundColor: "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#e74c3c"}
              onBlur={(e) => e.target.style.borderColor = "#d9e0e9"}
            >
              <option value="">-- Chọn khách hàng --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#333" }}>Trạng thái:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                border: "1px solid #d9e0e9", 
                borderRadius: "8px", 
                fontSize: "14px",
                transition: "all 0.3s",
                outline: "none",
                backgroundColor: "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#e74c3c"}
              onBlur={(e) => e.target.style.borderColor = "#d9e0e9"}
            >
              {Object.entries(STATUS).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#333" }}>Chọn sản phẩm:</label>
            <select
              onChange={(e) => handleAddProduct(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                border: "1px solid #d9e0e9", 
                borderRadius: "8px", 
                fontSize: "14px",
                transition: "all 0.3s",
                outline: "none",
                backgroundColor: "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#e74c3c"}
              onBlur={(e) => e.target.style.borderColor = "#d9e0e9"}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.price.toLocaleString()}đ
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.items.length > 0 && (
          <div style={{ marginBottom: "16px", backgroundColor: "#f9fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e8eef3" }}>
            <h4 style={{ marginTop: 0, marginBottom: "12px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Sản phẩm trong đơn ({form.items.length} sản phẩm):</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#fff" }}>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #e74c3c", fontWeight: "600", color: "#e74c3c" }}>Sản phẩm</th>
                    <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #e74c3c", fontWeight: "600", color: "#e74c3c", width: "80px" }}>Giá</th>
                    <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #e74c3c", fontWeight: "600", color: "#e74c3c", width: "100px" }}>Số lượng</th>
                    <th style={{ padding: "10px", textAlign: "right", borderBottom: "2px solid #e74c3c", fontWeight: "600", color: "#e74c3c", width: "100px" }}>Thành tiền</th>
                    <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #e74c3c", fontWeight: "600", color: "#e74c3c", width: "60px" }}>-</th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item: OrderItem) => {
                    const product = products.find((p) => p.id === item.productId);
                    return (
                      <tr key={item.productId} style={{ borderBottom: "1px solid #e8eef3", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f3ff"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <td style={{ padding: "10px" }}>{product?.name}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: "#e74c3c", fontWeight: "600" }}>{item.price.toLocaleString()}đ</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            style={{ width: "50px", padding: "6px", border: "1px solid #d9e0e9", borderRadius: "6px", textAlign: "center", outline: "none" }}
                          />
                        </td>
                        <td style={{ padding: "10px", textAlign: "right", fontWeight: "600", color: "#333" }}>
                          {(item.price * item.quantity).toLocaleString()}đ
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <button
                            onClick={() => handleRemoveProduct(item.productId)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#e74c3c",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = "#c0392b"; e.currentTarget.style.transform = "scale(1.05)"}}
                            onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = "#e74c3c"; e.currentTarget.style.transform = "scale(1)"}}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "12px", textAlign: "right", padding: "12px", backgroundColor: "white", borderRadius: "6px", fontWeight: "700", fontSize: "15px", color: "#e74c3c" }}>
              Tổng tiền: {calculateTotal(form.items).toLocaleString()}đ
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "11px 24px",
              background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(231, 76, 60, 0.4)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {editingId ? "Cập nhật" : "Thêm đơn"}
          </button>
          {editingId && (
            <button
              onClick={handleReset}
              style={{
                padding: "11px 24px",
                backgroundColor: "#95a3b3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7a8a98"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#95a3b3"}
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hoặc khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            flex: 1, 
            minWidth: "250px", 
            padding: "11px 14px", 
            border: "1px solid #d9e0e9", 
            borderRadius: "8px",
            fontSize: "14px",
            transition: "all 0.3s",
            backgroundColor: "white",
            outline: "none",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}
          onFocus={(e) => {e.target.style.borderColor = "#e74c3c"; e.target.style.boxShadow = "0 0 0 3px rgba(231, 76, 60, 0.1)"}}
          onBlur={(e) => {e.target.style.borderColor = "#d9e0e9"; e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"}}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ 
            padding: "11px 12px", 
            border: "1px solid #d9e0e9", 
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "white",
            outline: "none",
            transition: "all 0.3s",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            cursor: "pointer"
          }}
        >
          <option value="">Tất cả trạng thái</option>
          {Object.values(STATUS).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          style={{ 
            padding: "11px 12px", 
            border: "1px solid #d9e0e9", 
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "white",
            outline: "none",
            transition: "all 0.3s",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            cursor: "pointer"
          }}
        >
          <option value="date">Sắp xếp theo ngày</option>
          <option value="total">Sắp xếp theo tổng tiền</option>
        </select>
      </div>

      <div style={{ overflowX: "auto", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" }}>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600", fontSize: "13px" }}>Mã đơn</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600", fontSize: "13px" }}>Khách hàng</th>
              <th style={{ padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600", fontSize: "13px" }}>Ngày đặt hàng</th>
              <th style={{ padding: "14px 16px", textAlign: "right", color: "white", fontWeight: "600", fontSize: "13px" }}>Tổng tiền</th>
              <th style={{ padding: "14px 16px", textAlign: "center", color: "white", fontWeight: "600", fontSize: "13px" }}>Trạng thái</th>
              <th style={{ padding: "14px 16px", textAlign: "center", color: "white", fontWeight: "600", fontSize: "13px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((o, idx) => (
                <tr 
                  key={o.orderId} 
                  style={{ 
                    borderBottom: "1px solid #e8eef3",
                    transition: "all 0.2s",
                    backgroundColor: idx % 2 === 0 ? "white" : "#f9fafc"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f3ff"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "white" : "#f9fafc"}
                >
                  <td style={{ padding: "14px 16px", fontWeight: "600", color: "#e74c3c" }}>{o.orderId}</td>
                  <td style={{ padding: "14px 16px", color: "#333" }}>
                    {customers.find((c) => c.id === o.customerId)?.name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#666", fontSize: "13px" }}>
                    {new Date(o.orderDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: "700", color: "#333", fontSize: "15px" }}>
                    {o.totalAmount.toLocaleString()}đ
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      display: "inline-block",
                      backgroundColor:
                        o.status === STATUS.PENDING
                          ? "#fff3cd"
                          : o.status === STATUS.SHIPPING
                          ? "#cfe2ff"
                          : o.status === STATUS.COMPLETED
                          ? "#d1e7dd"
                          : "#f8d7da",
                      color:
                        o.status === STATUS.PENDING
                          ? "#664d03"
                          : o.status === STATUS.SHIPPING
                          ? "#084298"
                          : o.status === STATUS.COMPLETED
                          ? "#0f5132"
                          : "#842029",
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button
                      onClick={() => handleEdit(o.orderId)}
                      style={{
                        padding: "7px 14px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = "#0056b3"; e.currentTarget.style.transform = "scale(1.05)"}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = "#007bff"; e.currentTarget.style.transform = "scale(1)"}}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleCancel(o.orderId)}
                      disabled={o.status !== STATUS.PENDING}
                      style={{
                        padding: "7px 14px",
                        backgroundColor: o.status === STATUS.PENDING ? "#dc3545" : "#e9ecef",
                        color: o.status === STATUS.PENDING ? "white" : "#6c757d",
                        border: "none",
                        borderRadius: "6px",
                        cursor: o.status === STATUS.PENDING ? "pointer" : "not-allowed",
                        fontSize: "12px",
                        fontWeight: "600",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {if (o.status === STATUS.PENDING) {e.currentTarget.style.backgroundColor = "#bb2d3b"; e.currentTarget.style.transform = "scale(1.05)"}}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = o.status === STATUS.PENDING ? "#dc3545" : "#e9ecef"; e.currentTarget.style.transform = "scale(1)"}}
                    >
                        Hủy
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontSize: "14px" }}>
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
