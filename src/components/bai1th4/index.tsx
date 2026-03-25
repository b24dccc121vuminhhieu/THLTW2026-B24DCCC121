import React, { useState } from "react";

type FieldType = "string" | "number" | "date";

interface DynamicField {
  id: string;
  name: string;
  type: FieldType;
}

interface SoVanBang {
  nam: number;
  soHienTai: number;
}

interface Decision {
  id: string;
  soQD: string;
  ngayBanHanh: string;
  trichYeu: string;
  nam: number;
  totalSearch: number;
}

interface Diploma {
  id: string;
  soVaoSo: number;
  soHieu: string;
  msv: string;
  hoTen: string;
  ngaySinh: string;
  decisionId: string;
  dynamicData: Record<string, any>;
}

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const [soVanBang, setSoVanBang] = useState<SoVanBang>({
    nam: currentYear,
    soHienTai: 1,
  });

  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [fields, setFields] = useState<DynamicField[]>([
    { id: "gpa", name: "Điểm TB", type: "number" },
    { id: "noiSinh", name: "Nơi sinh", type: "string" },
  ]);

  const [form, setForm] = useState<any>({});
  const [editingDiplomaId, setEditingDiplomaId] = useState<string | null>(null);
  const [query, setQuery] = useState<any>({});
  const [result, setResult] = useState<Diploma[]>([]);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [newFieldForm, setNewFieldForm] = useState({ name: "", type: "string" as FieldType });
  const [newDecisionForm, setNewDecisionForm] = useState({
    soQD: "",
    ngayBanHanh: "",
    trichYeu: "",
  });

  const addField = () => {
    if (!newFieldForm.name.trim()) {
      alert("Tên trường không được để trống!");
      return;
    }
    const newField: DynamicField = {
      id: `field_${Date.now()}`,
      name: newFieldForm.name,
      type: newFieldForm.type,
    };
    setFields([...fields, newField]);
    setNewFieldForm({ name: "", type: "string" });
  };

  const updateField = (id: string) => {
    if (editingFieldId === id) {
      setEditingFieldId(null);
    } else {
      setEditingFieldId(id);
    }
  };

  const saveField = (id: string, newName: string, newType: FieldType) => {
    if (!newName.trim()) {
      alert("Tên trường không được để trống!");
      return;
    }
    setFields(
      fields.map((f) => (f.id === id ? { ...f, name: newName, type: newType } : f))
    );
    setEditingFieldId(null);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const addDecision = () => {
    if (!newDecisionForm.soQD.trim() || !newDecisionForm.ngayBanHanh) {
      alert("Vui lòng nhập đầy đủ thông tin quyết định!");
      return;
    }
    const d: Decision = {
      id: Date.now().toString(),
      soQD: newDecisionForm.soQD,
      ngayBanHanh: newDecisionForm.ngayBanHanh,
      trichYeu: newDecisionForm.trichYeu,
      nam: soVanBang.nam,
      totalSearch: 0,
    };
    setDecisions([...decisions, d]);
    setNewDecisionForm({ soQD: "", ngayBanHanh: "", trichYeu: "" });
  };

  const deleteDecision = (id: string) => {
    if (diplomas.some((d) => d.decisionId === id)) {
      alert("Không thể xóa quyết định có văn bằng! Xóa các văn bằng trước.");
      return;
    }
    setDecisions(decisions.filter((d) => d.id !== id));
  };

  const changeYear = (year: number) => {
    if (diplomas.length > 0) {
      alert("Không thể đổi năm khi còn văn bằng trong sổ hiện tại!");
      return;
    }
    setSoVanBang({
      nam: year,
      soHienTai: 1,
    });
  };

  const handleChange = (key: string, value: any) => {
    if (key.startsWith("dynamic.")) {
      const realKey = key.replace("dynamic.", "");
      setForm({
        ...form,
        dynamicData: {
          ...form.dynamicData,
          [realKey]: value,
        },
      });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const addDiploma = () => {
    if (!form.soHieu || !form.msv || !form.hoTen) {
      alert("Thiếu thông tin (Số hiệu, MSV, Họ tên)!");
      return;
    }
    if (!form.decisionId) {
      alert("Vui lòng chọn quyết định!");
      return;
    }

    const newDiploma: Diploma = {
      id: Date.now().toString(),
      soVaoSo: soVanBang.soHienTai,
      soHieu: form.soHieu,
      msv: form.msv,
      hoTen: form.hoTen,
      ngaySinh: form.ngaySinh || "",
      decisionId: form.decisionId,
      dynamicData: form.dynamicData || {},
    };

    setDiplomas([...diplomas, newDiploma]);

    setSoVanBang({
      ...soVanBang,
      soHienTai: soVanBang.soHienTai + 1,
    });

    setForm({});
  };

  const updateDiploma = () => {
    if (!editingDiplomaId) return;
    if (!form.soHieu || !form.msv || !form.hoTen) {
      alert("Thiếu thông tin!");
      return;
    }

    setDiplomas(
      diplomas.map((d) =>
        d.id === editingDiplomaId
          ? {
              ...d,
              soHieu: form.soHieu,
              msv: form.msv,
              hoTen: form.hoTen,
              ngaySinh: form.ngaySinh || "",
              decisionId: form.decisionId,
              dynamicData: form.dynamicData || {},
            }
          : d
      )
    );

    setEditingDiplomaId(null);
    setForm({});
  };

  const deleteDiploma = (id: string) => {
    setDiplomas(diplomas.filter((d) => d.id !== id));
  };

  const editDiploma = (diploma: Diploma) => {
    setEditingDiplomaId(diploma.id);
    setForm({
      soHieu: diploma.soHieu,
      msv: diploma.msv,
      hoTen: diploma.hoTen,
      ngaySinh: diploma.ngaySinh,
      decisionId: diploma.decisionId,
      dynamicData: diploma.dynamicData,
    });
  };

  const handleSearch = () => {
    const filled = Object.values(query).filter((v) => v);
    if (filled.length < 2) {
      alert("Nhập ít nhất 2 điều kiện tìm kiếm!");
      return;
    }

    const res = diplomas.filter((d) => {
      return (
        (!query.soHieu || d.soHieu.includes(query.soHieu)) &&
        (!query.msv || d.msv.includes(query.msv)) &&
        (!query.hoTen || d.hoTen.includes(query.hoTen)) &&
        (!query.soVaoSo || d.soVaoSo === Number(query.soVaoSo)) &&
        (!query.ngaySinh || d.ngaySinh.includes(query.ngaySinh))
      );
    });

    const updatedDecisions = decisions.map((dec) => {
      if (res.some((r) => r.decisionId === dec.id)) {
        return { ...dec, totalSearch: dec.totalSearch + 1 };
      }
      return dec;
    });

    setDecisions(updatedDecisions);
    setResult(res);
  };

  const clearSearch = () => {
    setQuery({});
    setResult([]);
  };

  const getDecisionInfo = (decisionId: string) => {
    return decisions.find((d) => d.id === decisionId);
  };

  return (
    <div style={{ padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: "1200px", margin: "0 auto", backgroundColor: "white" }}>
      <h1>Quản lý Sổ Văn Bằng Tốt Nghiệp</h1>

      <div style={{ padding: 15, borderRadius: 5, marginBottom: 20, backgroundColor: "white", border: "1px solid #ddd" }}>
        <h3>Thông tin Sổ Văn Bằng</h3>
        <p>
          <strong>Năm sổ:</strong> {soVanBang.nam} | <strong>Số tiếp theo:</strong> {soVanBang.soHienTai}
        </p>
        <button
          onClick={() => changeYear(soVanBang.nam + 1)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Mở sổ mới (Năm {soVanBang.nam + 1})
        </button>
      </div>

      <div style={{ padding: 15, borderRadius: 5, marginBottom: 20, backgroundColor: "white", border: "1px solid #ddd" }}>
        <h3>Cấu hình Biểu mẫu</h3>
        <p style={{ fontSize: 12, color: "#666" }}>Quản lý các trường thông tin bổ sung cho văn bằng</p>

        <div style={{ marginBottom: 15 }}>
          <label>
            Tên trường:{" "}
            <input
              type="text"
              placeholder="VD: Dân tộc, Ngành học..."
              value={newFieldForm.name}
              onChange={(e) => setNewFieldForm({ ...newFieldForm, name: e.target.value })}
              style={{ padding: "5px 10px", marginRight: 10, width: 200 }}
            />
          </label>
          <label>
            Kiểu:{" "}
            <select
              value={newFieldForm.type}
              onChange={(e) => setNewFieldForm({ ...newFieldForm, type: e.target.value as FieldType })}
              style={{ padding: "5px 10px", marginRight: 10 }}
            >
              <option value="string">Văn bản</option>
              <option value="number">Số</option>
              <option value="date">Ngày</option>
            </select>
          </label>
          <button
            onClick={addField}
            style={{
              padding: "5px 12px",
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            + Thêm
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ff7a45" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Tên trường</th>
              <th style={{ padding: 10, textAlign: "left" }}>Kiểu</th>
              <th style={{ padding: 10, textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 10 }}>
                  {editingFieldId === f.id ? (
                    <input
                      type="text"
                      defaultValue={f.name}
                      onBlur={(e) => saveField(f.id, e.target.value, f.type)}
                      autoFocus
                      style={{ padding: "5px 10px", width: "100%" }}
                    />
                  ) : (
                    f.name
                  )}
                </td>
                <td style={{ padding: 10, fontSize: 12 }}>
                  {editingFieldId === f.id ? (
                    <select
                      defaultValue={f.type}
                      onChange={(e) =>
                        saveField(f.id, f.name, e.target.value as FieldType)
                      }
                      style={{ padding: "5px 10px" }}
                    >
                      <option value="string">Văn bản</option>
                      <option value="number">Số</option>
                      <option value="date">Ngày</option>
                    </select>
                  ) : (
                    f.type === "string"
                      ? "Văn bản"
                      : f.type === "number"
                      ? "Số"
                      : "Ngày"
                  )}
                </td>
                <td style={{ padding: 10, textAlign: "center", fontSize: 12 }}>
                  <button
                    onClick={() => updateField(f.id)}
                    style={{
                      padding: "4px 8px",
                      marginRight: 5,
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                  >
                    {editingFieldId === f.id ? "Lưu" : "Sửa"}
                  </button>
                  <button
                    onClick={() => deleteField(f.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== DECISION MANAGEMENT ===== */}
      <div style={{ padding: 15, borderRadius: 5, marginBottom: 20, backgroundColor: "white", border: "1px solid #ddd" }}>
        <h3>Quyết định Tốt nghiệp</h3>

        <div style={{ marginBottom: 15 }}>
          <label>
            Số QĐ:{" "}
            <input
              type="text"
              placeholder="VD: QĐ001/2024"
              value={newDecisionForm.soQD}
              onChange={(e) => setNewDecisionForm({ ...newDecisionForm, soQD: e.target.value })}
              style={{ padding: "5px 10px", marginRight: 10 }}
            />
          </label>
          <label>
            Ngày ban hành:{" "}
            <input
              type="date"
              value={newDecisionForm.ngayBanHanh}
              onChange={(e) => setNewDecisionForm({ ...newDecisionForm, ngayBanHanh: e.target.value })}
              style={{ padding: "5px 10px", marginRight: 10 }}
            />
          </label>
        </div>

        <label>
          Trích yếu:{" "}
          <input
            type="text"
            placeholder="VD: Đợt tốt nghiệp kỳ 1"
            value={newDecisionForm.trichYeu}
            onChange={(e) => setNewDecisionForm({ ...newDecisionForm, trichYeu: e.target.value })}
            style={{ padding: "5px 10px", marginRight: 10, width: 300 }}
          />
        </label>
        <button
          onClick={addDecision}
          style={{
            padding: "5px 12px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          + Thêm QĐ
        </button>

        <table style={{ width: "100%", marginTop: 15, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #1890ff" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Số QĐ</th>
              <th style={{ padding: 10, textAlign: "left" }}>Ngày ban hành</th>
              <th style={{ padding: 10, textAlign: "left" }}>Trích yếu</th>
              <th style={{ padding: 10, textAlign: "center" }}>Lượt tra cứu</th>
              <th style={{ padding: 10, textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {decisions.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 10 }}>
                  <strong>{d.soQD}</strong>
                </td>
                <td style={{ padding: 10, fontSize: 12 }}>{d.ngayBanHanh}</td>
                <td style={{ padding: 10, fontSize: 12 }}>{d.trichYeu}</td>
                <td style={{ padding: 10, textAlign: "center", color: "#1890ff", fontWeight: "bold" }}>
                  {d.totalSearch}
                </td>
                <td style={{ padding: 10, textAlign: "center" }}>
                  <button
                    onClick={() => deleteDecision(d.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {decisions.length === 0 && (
          <p style={{ color: "#999", marginTop: 10, fontStyle: "italic" }}>Chưa có quyết định nào</p>
        )}
      </div>

      {/* ===== DIPLOMA FORM ===== */}
      <div style={{ padding: 15, borderRadius: 5, marginBottom: 20, backgroundColor: "white", border: "1px solid #ddd" }}>
        <h3>{editingDiplomaId ? "Sửa Văn Bằng" : "Thêm Văn Bằng Mới"}</h3>

        <div style={{ marginBottom: 10 }}>
          <label>
            Số vào sổ:{" "}
            <input
              type="text"
              value={editingDiplomaId ? form.soVaoSo || "" : soVanBang.soHienTai}
              readOnly
              style={{
                padding: "5px 10px",
                backgroundColor: "#f0f0f0",
                marginRight: 20,
                fontWeight: "bold",
              }}
            />
            <span style={{ fontSize: 12, color: "#666" }}> (Tự động, không chỉnh sửa)</span>
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Số hiệu (*):{" "}
            <input
              type="text"
              placeholder="VD: 2024001"
              value={form.soHieu || ""}
              onChange={(e) => handleChange("soHieu", e.target.value)}
              style={{ padding: "5px 10px", marginRight: 20 }}
            />
          </label>
          <label>
            MSV (*):{" "}
            <input
              type="text"
              placeholder="VD: MSV123456"
              value={form.msv || ""}
              onChange={(e) => handleChange("msv", e.target.value)}
              style={{ padding: "5px 10px", marginRight: 20 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Họ tên (*):{" "}
            <input
              type="text"
              placeholder="Họ và tên sinh viên"
              value={form.hoTen || ""}
              onChange={(e) => handleChange("hoTen", e.target.value)}
              style={{ padding: "5px 10px", marginRight: 20, width: 250 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Ngày sinh (*):{" "}
            <input
              type="date"
              value={form.ngaySinh || ""}
              onChange={(e) => handleChange("ngaySinh", e.target.value)}
              style={{ padding: "5px 10px", marginRight: 20 }}
            />
          </label>
          <label>
            Quyết định (*):{" "}
            <select
              value={form.decisionId || ""}
              onChange={(e) => handleChange("decisionId", e.target.value)}
              style={{ padding: "5px 10px", marginRight: 20 }}
            >
              <option value="">-- Chọn quyết định --</option>
              {decisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.soQD}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h4 style={{ marginTop: 15, marginBottom: 10 }}>Thông tin bổ sung</h4>
        <div style={{ padding: 10, borderRadius: 3 }}>
          {fields.length === 0 ? (
            <p style={{ color: "#999", fontSize: 12 }}>Chưa có trường thông tin bổ sung</p>
          ) : (
            fields.map((f) => (
              <div key={f.id} style={{ marginBottom: 10 }}>
                <label>
                  {f.name}:{" "}
                  {f.type === "string" && (
                    <input
                      type="text"
                      placeholder={f.name}
                      value={form.dynamicData?.[f.id] || ""}
                      onChange={(e) => handleChange(`dynamic.${f.id}`, e.target.value)}
                      style={{ padding: "5px 10px" }}
                    />
                  )}
                  {f.type === "number" && (
                    <input
                      type="number"
                      placeholder={f.name}
                      value={form.dynamicData?.[f.id] || ""}
                      onChange={(e) => handleChange(`dynamic.${f.id}`, parseFloat(e.target.value))}
                      style={{ padding: "5px 10px" }}
                    />
                  )}
                  {f.type === "date" && (
                    <input
                      type="date"
                      value={form.dynamicData?.[f.id] || ""}
                      onChange={(e) => handleChange(`dynamic.${f.id}`, e.target.value)}
                      style={{ padding: "5px 10px" }}
                    />
                  )}
                </label>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 15 }}>
          {editingDiplomaId ? (
            <>
              <button
                onClick={updateDiploma}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  marginRight: 10,
                }}
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setEditingDiplomaId(null);
                  setForm({});
                }}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={addDiploma}
              style={{
                padding: "8px 15px",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Lưu Văn Bằng
            </button>
          )}
        </div>
      </div>

      {/* ===== DIPLOMA LIST ===== */}
      <div style={{ padding: 15, borderRadius: 5, marginBottom: 20, backgroundColor: "white", border: "1px solid #ddd" }}>
        <h3>Danh sách Văn Bằng ({diplomas.length})</h3>

        {diplomas.length === 0 ? (
          <p style={{ color: "#999", fontStyle: "italic" }}>Chưa có văn bằng nào</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #999" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Số vào sổ</th>
                <th style={{ padding: 10, textAlign: "left" }}>Số hiệu</th>
                <th style={{ padding: 10, textAlign: "left" }}>MSV</th>
                <th style={{ padding: 10, textAlign: "left" }}>Họ tên</th>
                <th style={{ padding: 10, textAlign: "left" }}>QĐ</th>
                <th style={{ padding: 10, textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {diplomas.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 10 }}>
                    <strong>{d.soVaoSo}</strong>
                  </td>
                  <td style={{ padding: 10 }}>{d.soHieu}</td>
                  <td style={{ padding: 10, fontSize: 12 }}>{d.msv}</td>
                  <td style={{ padding: 10 }}>{d.hoTen}</td>
                  <td style={{ padding: 10, fontSize: 12 }}>
                    {getDecisionInfo(d.decisionId)?.soQD || "---"}
                  </td>
                  <td style={{ padding: 10, textAlign: "center", fontSize: 12 }}>
                    <button
                      onClick={() => editDiploma(d)}
                      style={{
                        padding: "4px 8px",
                        marginRight: 5,
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: "pointer",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteDiploma(d.id)}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: "pointer",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== SEARCH ===== */}
      <div style={{ backgroundColor: "white", padding: 15, borderRadius: 5, border: "1px solid #ddd" }}>
        <h3>Tra cứu Văn Bằng</h3>
        <p style={{ fontSize: 12, color: "#666" }}>*Vui lòng nhập ít nhất 2 tham số tìm kiếm</p>

        <div style={{ marginBottom: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label>
            Số hiệu:{" "}
            <input
              placeholder="Số hiệu bằng"
              value={query.soHieu || ""}
              onChange={(e) => setQuery({ ...query, soHieu: e.target.value })}
              style={{ padding: "5px 10px", width: "100%" }}
            />
          </label>
          <label>
            MSV:{" "}
            <input
              placeholder="Mã sinh viên"
              value={query.msv || ""}
              onChange={(e) => setQuery({ ...query, msv: e.target.value })}
              style={{ padding: "5px 10px", width: "100%" }}
            />
          </label>
          <label>
            Họ tên:{" "}
            <input
              placeholder="Họ và tên"
              value={query.hoTen || ""}
              onChange={(e) => setQuery({ ...query, hoTen: e.target.value })}
              style={{ padding: "5px 10px", width: "100%" }}
            />
          </label>
          <label>
            Số vào sổ:{" "}
            <input
              placeholder="Số vào sổ"
              value={query.soVaoSo || ""}
              onChange={(e) => setQuery({ ...query, soVaoSo: e.target.value })}
              style={{ padding: "5px 10px", width: "100%" }}
            />
          </label>
          <label>
            Ngày sinh:{" "}
            <input
              type="date"
              value={query.ngaySinh || ""}
              onChange={(e) => setQuery({ ...query, ngaySinh: e.target.value })}
              style={{ padding: "5px 10px", width: "100%" }}
            />
          </label>
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: "8px 15px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          Tìm kiếm
        </button>
        <button
          onClick={clearSearch}
          style={{
            padding: "8px 15px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Xóa
        </button>

        {result.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4>Kết quả tìm kiếm ({result.length})</h4>
            {result.map((d) => {
              const decision = getDecisionInfo(d.decisionId);
              return (
                <div key={d.id} style={{ backgroundColor: "white", padding: 15, marginBottom: 10, borderRadius: 4, border: "1px solid #ddd" }}>
                  <h5 style={{ marginTop: 0 }}>
                    {d.hoTen} <span style={{ fontSize: 12, color: "#999" }}>({d.msv})</span>
                  </h5>
                  <table style={{ width: "100%", fontSize: 12 }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: 5, width: "25%" }}>
                          <strong>Số vào sổ:</strong> {d.soVaoSo}
                        </td>
                        <td style={{ padding: 5, width: "25%" }}>
                          <strong>Số hiệu:</strong> {d.soHieu}
                        </td>
                        <td style={{ padding: 5, width: "25%" }}>
                          <strong>Ngày sinh:</strong> {d.ngaySinh || "---"}
                        </td>
                        <td style={{ padding: 5, width: "25%" }}>
                          <strong>Năm:</strong> {soVanBang.nam}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #eee" }}>
                    <p style={{ marginBottom: 5 }}>
                      <strong>Quyết định:</strong> {decision?.soQD} - {decision?.trichYeu}
                    </p>
                    <p style={{ marginBottom: 5 }}>
                      <strong>Ngày ban hành:</strong> {decision?.ngayBanHanh}
                    </p>
                  </div>
                  {Object.keys(d.dynamicData).length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #eee" }}>
                      <strong>Thông tin bổ sung:</strong>
                      <ul style={{ marginTop: 5, marginBottom: 0 }}>
                        {fields.map((f) => (
                          d.dynamicData[f.id] !== undefined && (
                            <li key={f.id}>
                              {f.name}: <strong>{d.dynamicData[f.id]}</strong>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {result.length === 0 && Object.values(query).some((v) => v) && (
          <p style={{ marginTop: 15, color: "#ff4d4f" }}>❌ Không tìm thấy kết quả phù hợp</p>
        )}
      </div>
    </div>
  );
};

/* ================= RENDER ================= */
export default App;