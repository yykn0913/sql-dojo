import { useState, useMemo } from "react";

const KEYWORDS = new Set([
  "SELECT","FROM","WHERE","AND","OR","NOT","IN","LIKE","BETWEEN","IS","NULL",
  "ORDER","BY","GROUP","HAVING","LIMIT","JOIN","ON","LEFT","RIGHT","INNER",
  "COUNT","SUM","AVG","MAX","MIN","AS","DISTINCT","DESC","ASC","WITH","CASE",
  "WHEN","THEN","ELSE","END","INSERT","INTO","VALUES","UPDATE","SET",
  "DELETE","CREATE","TABLE","VIEW","DROP","ALTER","ADD","COLUMN",
  "PRIMARY","KEY","FOREIGN","REFERENCES","UNIQUE","DEFAULT","CHECK",
  "EXISTS","UNION","ALL",
]);

function getTokenType(token) {
  const upper = token.toUpperCase().replace(/,$/, "").replace(/^\(/, "").replace(/\)$/, "");
  if (KEYWORDS.has(upper)) return "keyword";
  if (token.startsWith("'") || token.endsWith("'")) return "string";
  if (/^\d+$/.test(token)) return "number";
  if (/^[=<>!*+\-/%]+$/.test(token)) return "operator";
  if (/^[(),;]$/.test(token)) return "punct";
  return "ident";
}

function splitTokens(sql) {
  const tokens = [];
  let cur = "";
  let inStr = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (c === "'" && !inStr) { inStr = true; cur += c; }
    else if (c === "'" && inStr) { inStr = false; cur += c; tokens.push(cur); cur = ""; }
    else if (c === " " && !inStr) { if (cur) tokens.push(cur); cur = ""; }
    else { cur += c; }
  }
  if (cur) tokens.push(cur);
  return tokens.filter((t) => t.trim());
}

const DISTRACTOR_POOL = [
  "AVG","COUNT(*)","DISTINCT","HAVING","LIMIT","MAX","MIN","NOT","NULL",
  "OR","ORDER","SUM","UNION","*","!=","<=",">=","2","10","100",
  "LEFT","RIGHT","CROSS","FULL","EXISTS","BETWEEN","LIKE",
];

function buildTokenPool(answer) {
  const answerTokens = splitTokens(answer);
  const answerSet = new Set(answerTokens.map((t) => t.toUpperCase()));
  const distractors = DISTRACTOR_POOL
    .filter((d) => !answerSet.has(d.toUpperCase()))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  return [...answerTokens, ...distractors]
    .sort(() => Math.random() - 0.5)
    .map((text, i) => ({ id: i, text }));
}

const TYPE_CLASS = {
  keyword: "token-kw", string: "token-str", number: "token-num",
  operator: "token-op", ident: "token-id", punct: "token-punct",
};

export default function SqlBuilder({ answer, onQueryChange }) {
  const pool = useMemo(() => buildTokenPool(answer), [answer]);
  const [selected, setSelected] = useState([]);
  const [available, setAvailable] = useState(pool);
  // insertAt: 次のトークンをどの位置に挿入するか（デフォルト末尾）
  const [insertAt, setInsertAt] = useState(null); // null = 末尾

  function notify(newSelected) {
    onQueryChange(newSelected.map((t) => t.text).join(" "));
  }

  function addToken(token) {
    const pos = insertAt === null ? selected.length : insertAt;
    const newSelected = [
      ...selected.slice(0, pos),
      token,
      ...selected.slice(pos),
    ];
    setSelected(newSelected);
    setAvailable((a) => a.filter((t) => t.id !== token.id));
    // カーソルを挿入位置の次へ
    setInsertAt(pos + 1);
    notify(newSelected);
  }

  function removeToken(idx) {
    const removed = selected[idx];
    const newSelected = selected.filter((_, i) => i !== idx);
    setSelected(newSelected);
    setAvailable((a) => [...a, removed]);
    // カーソルが削除位置以降なら1つ前へ
    if (insertAt !== null && insertAt > idx) {
      setInsertAt(Math.max(0, insertAt - 1));
    }
    if (newSelected.length === 0) setInsertAt(null);
    notify(newSelected);
  }

  function undoLast() {
    if (selected.length === 0) return;
    const last = selected[selected.length - 1];
    const newSelected = selected.slice(0, -1);
    setSelected(newSelected);
    setAvailable((a) => [...a, last]);
    setInsertAt(null);
    notify(newSelected);
  }

  function clearAll() {
    setSelected([]);
    setAvailable(pool);
    setInsertAt(null);
    onQueryChange("");
  }

  const cursorPos = insertAt === null ? selected.length : insertAt;

  return (
    <div className="sql-builder">
      {/* 挿入位置の説明 */}
      <p className="builder-hint-text">
        {selected.length === 0
          ? "下のトークンをタップして並べよう"
          : cursorPos === selected.length
          ? "▼ 末尾に追加中（トークン間の ＋ で挿入位置を変更）"
          : `▼ ${cursorPos + 1}番目の前に挿入中`}
      </p>

      {/* 選択済みエリア */}
      <div className="builder-answer">
        {selected.length === 0 ? (
          <span className="builder-placeholder">ここにトークンが並びます</span>
        ) : (
          <>
            {/* 先頭の挿入ポイント */}
            <button
              className={`insert-point ${cursorPos === 0 ? "active" : ""}`}
              onClick={() => setInsertAt(0)}
            >+</button>

            {selected.map((tok, idx) => (
              <span key={tok.id} className="token-wrap">
                <button
                  className={`token selected ${TYPE_CLASS[getTokenType(tok.text)]}`}
                  onClick={() => removeToken(idx)}
                >
                  {tok.text}
                  <span className="token-remove">×</span>
                </button>
                {/* 各トークンの後ろの挿入ポイント */}
                <button
                  className={`insert-point ${cursorPos === idx + 1 ? "active" : ""}`}
                  onClick={() => setInsertAt(idx + 1 === selected.length ? null : idx + 1)}
                >+</button>
              </span>
            ))}
          </>
        )}
      </div>

      {/* 操作ボタン */}
      {selected.length > 0 && (
        <div className="builder-actions">
          <button className="builder-undo" onClick={undoLast}>⌫ 一つ戻す</button>
          <button className="builder-clear" onClick={clearAll}>✕ 全クリア</button>
        </div>
      )}

      {/* 選択肢エリア */}
      <div className="builder-pool">
        {available.map((tok) => (
          <button
            key={tok.id}
            className={`token ${TYPE_CLASS[getTokenType(tok.text)]}`}
            onClick={() => addToken(tok)}
          >
            {tok.text}
          </button>
        ))}
      </div>
    </div>
  );
}
