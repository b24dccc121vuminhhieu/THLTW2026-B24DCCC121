import React, { useState } from "react";

type Choice = "Kéo" | "Búa" | "Bao";

const choices: { name: Choice; icon: string }[] = [
  { name: "Kéo", icon: "✌️" },
  { name: "Búa", icon: "✊" },
  { name: "Bao", icon: "✋" },
];

function getResult(player: Choice, computer: Choice) {
  if (player === computer) return "Hòa";

  if (
    (player === "Kéo" && computer === "Bao") ||
    (player === "Búa" && computer === "Kéo") ||
    (player === "Bao" && computer === "Búa")
  )
    return "Thắng";

  return "Thua";
}

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  const play = (player: Choice) => {
    const computer =
      choices[Math.floor(Math.random() * choices.length)].name;

    const gameResult = getResult(player, computer);

    setPlayerChoice(player);
    setComputerChoice(computer);
    setResult(gameResult);

    const text = `Bạn: ${player} | Máy: ${computer} → ${gameResult}`;
    setHistory((prev) => [text, ...prev]);

    if (gameResult === "Thắng")
      setScore((s) => ({ ...s, win: s.win + 1 }));
    else if (gameResult === "Thua")
      setScore((s) => ({ ...s, lose: s.lose + 1 }));
    else
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
    setHistory([]);
    setScore({ win: 0, lose: 0, draw: 0 });
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        textAlign: "center",
        fontFamily: "Arial",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <h1>🎮 Oẳn Tù Tì</h1>

      <div>
        {choices.map((c) => (
          <button
            key={c.name}
            onClick={() => play(c.name)}
            style={{
              margin: 10,
              padding: "15px 25px",
              fontSize: 20,
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {playerChoice && (
        <div style={{ marginTop: 20 }}>
          <p>Bạn chọn: <b>{playerChoice}</b></p>
          <p>Máy chọn: <b>{computerChoice}</b></p>
          <h2>Kết quả: {result}</h2>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>📊 Điểm</h3>
        <p>
          Thắng: {score.win} | Thua: {score.lose} | Hòa: {score.draw}
        </p>
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          fontSize: 16,
          borderRadius: 8,
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        🔄 Chơi lại từ đầu
      </button>

      <div style={{ textAlign: "left", marginTop: 20 }}>
        <h3>🕘 Lịch sử</h3>
        <ul>
          {history.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}