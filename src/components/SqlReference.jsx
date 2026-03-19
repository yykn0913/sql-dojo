import { useState } from "react";
import { sqlReference } from "../data/sqlReference";
import SqlHighlight from "./SqlHighlight";

export default function SqlReference() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(null);

  const category = sqlReference[activeCategory];

  return (
    <div className="sql-ref">
      <div className="sql-ref-header">
        <h2>📚 SQL リファレンス</h2>
        <p>関数・構文の使い方を確認しよう</p>
      </div>

      {/* カテゴリタブ */}
      <div className="sql-ref-tabs">
        {sqlReference.map((cat, i) => (
          <button
            key={i}
            className={`ref-tab ${activeCategory === i ? "active" : ""}`}
            onClick={() => { setActiveCategory(i); setActiveItem(null); }}
          >
            {cat.emoji} {cat.category}
          </button>
        ))}
      </div>

      {/* 関数一覧 */}
      <div className="sql-ref-list">
        {category.items.map((item, i) => (
          <div key={i}>
            <button
              className={`ref-item ${activeItem === i ? "active" : ""}`}
              onClick={() => setActiveItem(activeItem === i ? null : i)}
            >
              <span className="ref-item-name">{item.name}</span>
              <span className="ref-item-toggle">{activeItem === i ? "▲" : "▼"}</span>
            </button>
            {activeItem === i && (
              <div className="ref-detail">
                <p className="ref-syntax">{item.syntax}</p>
                <p className="ref-desc">{item.desc}</p>
                <SqlHighlight sql={item.example} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
