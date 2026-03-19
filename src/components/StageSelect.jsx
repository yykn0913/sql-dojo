import { stages } from "../data/stages";
import { DIFFICULTY_CONFIG } from "../data/stages";
import SqlReference from "./SqlReference";

export default function StageSelect({ clearedStages, difficulty, onDifficulty, onSelect }) {
  return (
    <div className="home-layout">
      <div className="stage-select">
        <div className="stage-header">
          <h1>🗾 SQL道場</h1>
          <p>ステージを選んで挑戦しよう</p>
          {/* 難易度セレクター */}
          <div className="difficulty-selector">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                className={`diff-btn ${difficulty === key ? "active" : ""}`}
                onClick={() => onDifficulty(key)}
              >
                {cfg.emoji} {cfg.label}
              </button>
            ))}
          </div>
          <p className="difficulty-desc">
            {DIFFICULTY_CONFIG[difficulty].emoji} {DIFFICULTY_CONFIG[difficulty].label}：
            {difficulty === "easy" && "level 1 の問題から 3問"}
            {difficulty === "normal" && "level 1〜2 の問題から 4問"}
            {difficulty === "hard" && "level 2〜3 の問題から 5問"}
          </p>
        </div>
        <div className="stage-grid">
          {stages.map((stage) => {
            const cleared = clearedStages.includes(stage.id);
            return (
              <button
                key={stage.id}
                className={`stage-card ${cleared ? "cleared" : ""}`}
                onClick={() => onSelect(stage)}
              >
                <span className="stage-emoji">{stage.emoji}</span>
                <span className="stage-num">Stage {stage.id}</span>
                <span className="stage-title">{stage.title}</span>
                <span className="stage-desc">{stage.description}</span>
                {cleared && <span className="clear-badge">✅ CLEAR</span>}
              </button>
            );
          })}
        </div>
      </div>

      <SqlReference />
    </div>
  );
}
