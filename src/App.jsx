import { useState } from "react";
import { useSqlJs } from "./hooks/useSqlJs";
import StageSelect from "./components/StageSelect";
import Challenge from "./components/Challenge";
import "./App.css";

export default function App() {
  const { loading, error, runQuery, runDML, runExpected } = useSqlJs();
  const [screen, setScreen] = useState("select"); // 'select' | 'challenge' | 'clear'
  const [currentStage, setCurrentStage] = useState(null);
  const [clearedStages, setClearedStages] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  function handleSelectStage(stage) {
    setCurrentStage(stage);
    setScreen("challenge");
  }

  function handleClear(result) {
    if (result.gaveUpCount === 0) {
      setClearedStages((prev) =>
        prev.includes(currentStage.id) ? prev : [...prev, currentStage.id]
      );
    }
    setLastResult(result);
    setScreen("clear");
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>SQLエンジン起動中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading">
        <p>⚠️ エラー: {error}</p>
      </div>
    );
  }

  if (screen === "clear" && lastResult) {
    const { score, gaveUpCount, total } = lastResult;
    const perfect = gaveUpCount === 0 && score === total;
    const cleared = gaveUpCount === 0;
    return (
      <div className="clear-screen">
        <div className={`clear-card ${cleared ? "cleared" : "gave-up"}`}>
          {perfect ? (
            <h1>🏆 PERFECT!</h1>
          ) : cleared ? (
            <h1>✅ STAGE CLEAR!</h1>
          ) : (
            <h1>📝 結果</h1>
          )}
          <p className="clear-stage">{currentStage.emoji} {currentStage.title}</p>
          <p className="clear-score">正解: {score} / {total}</p>
          {gaveUpCount > 0 && (
            <p className="gave-up-count">諦め: {gaveUpCount}問（クリア扱いにならず）</p>
          )}
          <button className="large-btn" onClick={() => setScreen("select")}>
            ステージ選択に戻る
          </button>
          {gaveUpCount > 0 && (
            <button className="retry-btn" onClick={() => setScreen("challenge")}>
              もう一度挑戦する
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === "challenge") {
    return (
      <Challenge
        stage={currentStage}
        onClear={handleClear}
        onBack={() => setScreen("select")}
        runQuery={runQuery}
        runDML={runDML}
        runExpected={runExpected}
      />
    );
  }

  return (
    <StageSelect
      clearedStages={clearedStages}
      onSelect={handleSelectStage}
    />
  );
}
