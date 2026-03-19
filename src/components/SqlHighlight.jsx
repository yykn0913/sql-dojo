// 静的なSQL表示用のシンタックスハイライト

const NEWLINE_BEFORE = [
  "FROM", "WHERE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "JOIN",
  "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "VALUES", "SET",
  "ON", "WITH", "UNION", "INTERSECT", "EXCEPT",
];

function formatSql(sql) {
  let result = sql.trim();
  NEWLINE_BEFORE.forEach((kw) => {
    result = result.replace(
      new RegExp(`\\b${kw.replace(" ", "\\s+")}\\b`, "gi"),
      (match) => `\n${match}`
    );
  });
  return result;
}

const STRINGS = /'[^']*'/g;
const NUMBERS = /\b(\d+)\b/g;
const OPERATORS = /([=<>!]+|[+\-*\/])/g;
const PARENS = /([()])/g;
const PUNCTUATION = /([,;])/g;

function tokenize(sql) {
  // トークン化：各部分に type を付ける
  const tokens = [];
  let remaining = sql;
  let pos = 0;

  while (remaining.length > 0) {
    // 文字列リテラル
    const strMatch = remaining.match(/^'[^']*'/);
    if (strMatch) {
      tokens.push({ type: "string", value: strMatch[0] });
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }

    // キーワード（大文字小文字無視）
    const kwMatch = remaining.match(/^(SELECT|FROM|WHERE|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|JOIN|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|INSERT\s+INTO|VALUES|UPDATE|SET|DELETE\s+FROM|DELETE|WITH|AS|DISTINCT|AND|OR|NOT\s+IN|NOT\s+NULL|NOT|IN|EXISTS|BETWEEN|LIKE|IS\s+NOT\s+NULL|IS\s+NULL|NULL|CASE|WHEN|THEN|ELSE|END|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|CREATE\s+VIEW|ADD\s+COLUMN|PRIMARY\s+KEY|FOREIGN\s+KEY|REFERENCES|NOT\s+NULL|UNIQUE|DEFAULT|CHECK|COUNT|SUM|AVG|MAX|MIN|UPPER|LOWER|LENGTH|SUBSTR|ROUND|ABS|CAST|COALESCE|UNION|INTERSECT|EXCEPT)\b/i);
    if (kwMatch) {
      tokens.push({ type: "keyword", value: kwMatch[0] });
      remaining = remaining.slice(kwMatch[0].length);
      continue;
    }

    // 数値
    const numMatch = remaining.match(/^\d+/);
    if (numMatch) {
      tokens.push({ type: "number", value: numMatch[0] });
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // 識別子（テーブル名・カラム名）
    const identMatch = remaining.match(/^[a-zA-Z_\u3000-\u9fff\u30A0-\u30FF\u3040-\u309F][a-zA-Z0-9_\u3000-\u9fff\u30A0-\u30FF\u3040-\u309F]*/u);
    if (identMatch) {
      tokens.push({ type: "ident", value: identMatch[0] });
      remaining = remaining.slice(identMatch[0].length);
      continue;
    }

    // その他（演算子・記号・空白・改行）
    tokens.push({ type: "other", value: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
}

const COLOR = {
  keyword: "#569cd6",   // VS Code青
  string:  "#ce9178",   // VS Codeオレンジ
  number:  "#b5cea8",   // VS Code緑
  ident:   "#9cdcfe",   // VS Code水色
  other:   "#d4d4d4",   // VS Codeデフォルト
};

export default function SqlHighlight({ sql: sqlText }) {
  const tokens = tokenize(formatSql(sqlText));
  return (
    <code className="sql-highlight">
      {tokens.map((tok, i) => (
        <span key={i} style={{ color: COLOR[tok.type] || COLOR.other }}>
          {tok.value}
        </span>
      ))}
    </code>
  );
}
