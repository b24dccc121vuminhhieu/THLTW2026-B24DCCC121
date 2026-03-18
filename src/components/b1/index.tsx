import { Card, InputNumber, Button, Typography } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export default function BaiTap01() {
  const [number] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(10);
  const [message, setMessage] = useState("");

  const checkGuess = () => {
    if (guess === null) return;

    if (guess === number) setMessage("Đúng rồi!");
else setMessage(guess > number ? "Quá cao" : "Quá thấp");

    setAttempt(attempt - 1);

    if (attempt - 1 === 0) {
      setMessage(`❌ Hết lượt! Số đúng là ${number}`);
    }
  };

  return (
    <Card style={{ width: 350, margin: "40px auto", textAlign: "center" }}>
      <Title level={4}>Game đoán số</Title>

      <InputNumber
        min={1}
        max={100}
        value={guess}
        onChange={(value) => setGuess(value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <Button type="primary" block onClick={checkGuess}>
        Đoán
      </Button>

      <Text>Số lượt còn lại: {attempt}</Text>
      <br />
      <Text>{message}</Text>
    </Card>
  );
}