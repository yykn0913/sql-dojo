import { useState, useMemo, useEffect } from "react";
import { DIFFICULTY_CONFIG } from "../data/stages";
import ResultTable from "./ResultTable";
import SqlEditor from "./SqlEditor";
import SqlHighlight from "./SqlHighlight";
import SqlBuilder from "./SqlBuilder";

function resultsEqual(a, b) {
  if (!a || !b) return false;
  if (a.length === 0 && b.length === 0) return true;
  if (a.length === 0 || b.length === 0) return false;
  return JSON.stringify(a[0].values) === JSON.stringify(b[0].values);
}

function pickByDifficulty(pool, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const filtered = pool.filter((p) => config.levels.includes(p.level));
  const source = filtered.length >= config.pick ? filtered : pool;
  return [...source].sort(() => Math.random() - 0.5).slice(0, Math.min(config.pick, source.length));
}

export default function Challenge({ stage, difficulty, onClear, onBack, runQuery, runDML, runExpected }) {
  const problems = useMemo(() => pickByDifficulty(stage.problemPool, difficulty), [stage, difficulty]);

  const [problemIdx, setProblemIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [judged, setJudged] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [score, setScore] = useState(0);
  const [gaveUpCount, setGaveUpCount] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const problem = problems[problemIdx];
  const isLast = problemIdx === problems.length - 1;
  const isDML = !!problem.verifyQuery;
  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  function handleRun() {
    let userResults, error;
    if (isDML) {
      ({ results: userResults, error } = runDML(stage.setup, query, problem.verifyQuery));
    } else {
      ({ results: userResults, error } = runQuery(stage.setup, query));
    }
    if (error) { setResult({ error }); setJudged("error"); return; }
    const expected = runExpected(stage.setup, problem.answer, isDML ? problem.verifyQuery : null);
    const correct = resultsEqual(userResults, expected);
    setResult({ results: userResults });
    setJudged(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (isLast) {
      onClear({ score, gaveUpCount, total: problems.length });
    } else {
      setProblemIdx((i) => i + 1);
      setQuery(""); setResult(null); setJudged(null);
      setShowHint(false); setGaveUp(false);
      // SqlBuilder は key で再マウントされるのでリセット不要
    }
  }

  function handleGiveUp() {
    setGaveUp(true);
    setGaveUpCount((c) => c + 1);
    setResult(null); setJudged(null);
  }

  const tablepreviews = stage.tableNames.map((name) => ({
    name,
    results: runQuery(stage.setup, `SELECT * FROM ${name}`).results,
  }));

  return (
    <div className="challenge">
      <div className="challenge-header">
        <button className="back-btn" onClick={onBack}>← 戻る</button>
        <div className="stage-info">
          <span>{stage.emoji} Stage {stage.id}: {stage.title}</span>
          <span className="progress">
            {diffConfig.emoji} {diffConfig.label} &nbsp;|&nbsp; {problemIdx + 1} / {problems.length}問
          </span>
        </div>
        <div className="score-badge">スコア: {score}</div>
      </div>

      <div className="challenge-body">
        {tablepreviews.map(({ name, results }) => (
          <section className="panel" key={name}>
            <h3>📋 テーブル: {name}</h3>
            <ResultTable results={results} />
          </section>
        ))}

        <section className="panel question-panel">
          <h3>❓ 問題 {problemIdx + 1}</h3>
          <p className="question-text">{problem.question}</p>
          {showHint && <p className="hint">💡 ヒント: {problem.hint}</p>}
          <div className="question-actions">
            {!showHint && !gaveUp && (
              <button className="hint-btn" onClick={() => setShowHint(true)}>💡 ヒントを見る</button>
            )}
            {!gaveUp && judged !== "correct" && (
              <button className="giveup-btn" onClick={handleGiveUp}>🏳️ 諦める</button>
            )}
          </div>
          {gaveUp && (
            <div className="answer-reveal">
              <p className="answer-label">答え</p>
              <SqlHighlight sql={problem.answer} />
              {problem.explanation && <p className="explanation">📖 {problem.explanation}</p>}
              <button className="next-btn" onClick={handleNext}>
                {isLast ? "結果を見る →" : "次の問題 →"}
              </button>
            </div>
          )}
        </section>

        {!gaveUp && (
          <section className="panel">
            <div className="input-mode-header">
              <h3>{isMobile ? "🧩 トークンを選んで並べよう" : "✏️ SQLを入力"}</h3>
              <button
                className="mode-toggle-btn"
                onClick={() => { setIsMobile((v) => !v); setQuery(""); }}
              >
                {isMobile ? "⌨️ キーボード入力" : "📱 モバイルモード"}
              </button>
            </div>
            {isMobile ? (
              <SqlBuilder
                key={`${problemIdx}-${problem.id}`}
                answer={problem.answer}
                onQueryChange={setQuery}
              />
            ) : (
              <SqlEditor
                value={query}
                onChange={setQuery}
                placeholder={isDML ? "INSERT / UPDATE / DELETE ..." : "SELECT ..."}
              />
            )}
            <button className="run-btn" onClick={handleRun} disabled={!query.trim()} style={{ marginTop: "10px" }}>
              ▶ 実行
            </button>
          </section>
        )}

        {result && !gaveUp && (
          <section className={`panel result-panel ${judged}`}>
            {judged === "correct" && <p className="judge correct">✅ 正解！</p>}
            {judged === "wrong" && <p className="judge wrong">❌ 不正解。もう一度！</p>}
            {judged === "error" && <p className="judge error">⚠️ エラー: {result.error}</p>}

            {result.results && <ResultTable results={result.results} />}

            {/* 不正解・エラー時も解説を表示 */}
            {(judged === "wrong" || judged === "error") && problem.explanation && (
              <div className="wrong-explanation">
                <p className="wrong-explanation-label">📖 解説</p>
                <p>{problem.explanation}</p>
              </div>
            )}

            {judged === "correct" && (
              <>
                <div className="model-answer">
                  <p className="model-answer-label">📝 模範解答</p>
                  <SqlHighlight sql={problem.answer} />
                  {problem.explanation && <p className="explanation">📖 {problem.explanation}</p>}
                </div>
                <button className="next-btn" onClick={handleNext}>
                  {isLast ? "結果を見る →" : "次の問題 →"}
                </button>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
