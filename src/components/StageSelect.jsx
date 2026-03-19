import { stages } from "../data/stages";
import SqlReference from "./SqlReference";

export default function StageSelect({ clearedStages, onSelect }) {
  return (
    <div className="home-layout">
      {/* 左：ステージ選択 */}
      <div className="stage-select">
        <div className="stage-header">
          <h1>🗾 SQL道場</h1>
          <p>ステージを選んで挑戦しよう</p>
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

      {/* 右：SQLリファレンス */}
      <SqlReference />
    </div>
  );
}
