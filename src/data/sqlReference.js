export const sqlReference = [
  {
    category: "SELECT 基本",
    emoji: "🎯",
    items: [
      {
        name: "SELECT",
        syntax: "SELECT カラム名 FROM テーブル名",
        desc: "テーブルからデータを取得する最も基本的な構文。",
        example: "SELECT name, salary FROM employees",
      },
      {
        name: "WHERE",
        syntax: "SELECT ... FROM ... WHERE 条件",
        desc: "条件に一致する行だけを絞り込む。",
        example: "SELECT * FROM employees WHERE salary >= 500000",
      },
      {
        name: "ORDER BY",
        syntax: "ORDER BY カラム名 [ASC|DESC]",
        desc: "結果を昇順(ASC)または降順(DESC)に並び替える。デフォルトはASC。",
        example: "SELECT * FROM employees ORDER BY salary DESC",
      },
      {
        name: "LIMIT",
        syntax: "LIMIT 件数",
        desc: "取得件数を制限する。ORDER BYと組み合わせて上位N件を取得できる。",
        example: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3",
      },
      {
        name: "DISTINCT",
        syntax: "SELECT DISTINCT カラム名 FROM ...",
        desc: "重複する値を除いた一覧を取得する。",
        example: "SELECT DISTINCT department FROM employees",
      },
      {
        name: "LIKE",
        syntax: "WHERE カラム名 LIKE 'パターン'",
        desc: "文字列の部分一致検索。% は0文字以上の任意文字列、_ は任意の1文字。",
        example: "SELECT * FROM employees WHERE name LIKE '%田%'",
      },
      {
        name: "BETWEEN",
        syntax: "WHERE カラム名 BETWEEN 値1 AND 値2",
        desc: "値1以上・値2以下の範囲で絞り込む（両端を含む）。",
        example: "SELECT * FROM employees WHERE age BETWEEN 25 AND 35",
      },
      {
        name: "IN",
        syntax: "WHERE カラム名 IN (値1, 値2, ...)",
        desc: "指定したリストの中に含まれる行を取得する。",
        example: "SELECT * FROM employees WHERE department IN ('営業', '開発')",
      },
      {
        name: "IS NULL",
        syntax: "WHERE カラム名 IS NULL",
        desc: "値がNULLの行を取得する。NULLの比較には = ではなく IS NULL を使う。",
        example: "SELECT * FROM employees WHERE dept_id IS NULL",
      },
    ],
  },
  {
    category: "関数・CASE式",
    emoji: "⚙️",
    items: [
      {
        name: "UPPER / LOWER",
        syntax: "UPPER(文字列) / LOWER(文字列)",
        desc: "文字列を大文字/小文字に変換する。",
        example: "SELECT UPPER(name) FROM employees",
      },
      {
        name: "LENGTH",
        syntax: "LENGTH(文字列)",
        desc: "文字列の長さ（文字数）を返す。",
        example: "SELECT name, LENGTH(name) FROM employees",
      },
      {
        name: "SUBSTR",
        syntax: "SUBSTR(文字列, 開始位置, 文字数)",
        desc: "文字列の一部を切り出す。開始位置は1始まり。",
        example: "SELECT SUBSTR(name, 1, 1) FROM employees",
      },
      {
        name: "ROUND",
        syntax: "ROUND(数値, 小数桁数)",
        desc: "指定した桁数で四捨五入する。桁数を省略すると整数に丸める。",
        example: "SELECT ROUND(AVG(salary), 0) FROM employees",
      },
      {
        name: "ABS",
        syntax: "ABS(数値)",
        desc: "数値の絶対値を返す。",
        example: "SELECT ABS(-500) -- 結果: 500",
      },
      {
        name: "CAST",
        syntax: "CAST(値 AS 型)",
        desc: "値を別の型に変換する。型はINTEGER/REAL/TEXTなど。",
        example: "SELECT CAST(salary / 10000 AS INTEGER) FROM employees",
      },
      {
        name: "COALESCE",
        syntax: "COALESCE(値1, 値2, ...)",
        desc: "左から順に評価し、最初にNULLでない値を返す。NULLの置き換えに使う。",
        example: "SELECT COALESCE(dept_id, 0) FROM employees",
      },
      {
        name: "CASE",
        syntax: "CASE WHEN 条件 THEN 値 ... ELSE デフォルト END",
        desc: "条件分岐を行う式。複数のWHEN句を並べられる。",
        example: "SELECT name, CASE WHEN salary >= 500000 THEN '高給' ELSE '標準' END FROM employees",
      },
    ],
  },
  {
    category: "集計関数",
    emoji: "📊",
    items: [
      {
        name: "COUNT",
        syntax: "COUNT(*) / COUNT(カラム名)",
        desc: "行数を数える。COUNT(*)はNULL含む全行、COUNT(カラム)はNULLを除く。",
        example: "SELECT COUNT(*) FROM employees",
      },
      {
        name: "SUM",
        syntax: "SUM(カラム名)",
        desc: "数値カラムの合計を返す。NULLは無視される。",
        example: "SELECT SUM(salary) FROM employees",
      },
      {
        name: "AVG",
        syntax: "AVG(カラム名)",
        desc: "数値カラムの平均を返す。NULLは無視される。",
        example: "SELECT AVG(salary) FROM employees",
      },
      {
        name: "MAX / MIN",
        syntax: "MAX(カラム名) / MIN(カラム名)",
        desc: "最大値・最小値を返す。文字列カラムにも使用可能。",
        example: "SELECT MAX(salary), MIN(salary) FROM employees",
      },
      {
        name: "GROUP BY",
        syntax: "GROUP BY カラム名",
        desc: "指定したカラムの値でグループ化する。集計関数と組み合わせて使う。",
        example: "SELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id",
      },
      {
        name: "HAVING",
        syntax: "GROUP BY ... HAVING 条件",
        desc: "GROUP BY後のグループに対して条件を指定する。WHEREはグループ化前、HAVINGはグループ化後。",
        example: "SELECT dept_id, AVG(salary) FROM employees GROUP BY dept_id HAVING AVG(salary) > 450000",
      },
    ],
  },
  {
    category: "JOIN（結合）",
    emoji: "🔗",
    items: [
      {
        name: "INNER JOIN",
        syntax: "FROM A INNER JOIN B ON A.key = B.key",
        desc: "両テーブルに一致するレコードだけを返す。最も基本的な結合。",
        example: "SELECT e.name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id",
      },
      {
        name: "LEFT JOIN",
        syntax: "FROM A LEFT JOIN B ON A.key = B.key",
        desc: "左テーブルの全行を保持。一致しない右テーブルの値はNULLになる。",
        example: "SELECT e.name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id",
      },
      {
        name: "テーブルの別名",
        syntax: "FROM テーブル名 AS 別名",
        desc: "テーブルに短い別名をつけてSQLを簡潔に書ける。",
        example: "SELECT e.name FROM employees AS e JOIN departments AS d ON e.dept_id = d.dept_id",
      },
    ],
  },
  {
    category: "サブクエリ・WITH句",
    emoji: "🧠",
    items: [
      {
        name: "スカラサブクエリ",
        syntax: "WHERE カラム = (SELECT ...)",
        desc: "WHERE句の中で1つの値を返すSELECT文を使う。",
        example: "SELECT name FROM employees WHERE salary = (SELECT MAX(salary) FROM employees)",
      },
      {
        name: "IN サブクエリ",
        syntax: "WHERE カラム IN (SELECT ...)",
        desc: "サブクエリの結果リストに含まれる行を取得する。",
        example: "SELECT dept_name FROM departments WHERE dept_id IN (SELECT dept_id FROM employees)",
      },
      {
        name: "EXISTS",
        syntax: "WHERE EXISTS (SELECT 1 FROM ... WHERE ...)",
        desc: "サブクエリが1行以上返す場合にTRUEになる。INより高速なケースが多い。",
        example: "SELECT dept_name FROM departments d WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id)",
      },
      {
        name: "WITH句（CTE）",
        syntax: "WITH 名前 AS (SELECT ...) SELECT ... FROM 名前",
        desc: "Common Table Expression。サブクエリに名前をつけて再利用できる。可読性が大幅に向上する。",
        example: "WITH avg_sal AS (SELECT dept_id, AVG(salary) AS avg FROM employees GROUP BY dept_id) SELECT * FROM avg_sal WHERE avg > 450000",
      },
    ],
  },
  {
    category: "DML（データ操作）",
    emoji: "✏️",
    items: [
      {
        name: "INSERT",
        syntax: "INSERT INTO テーブル名 VALUES (値1, 値2, ...)",
        desc: "新しい行を挿入する。カラムを指定して一部だけ挿入することも可能。",
        example: "INSERT INTO employees (id, name, salary) VALUES (9, '新田', 420000)",
      },
      {
        name: "UPDATE",
        syntax: "UPDATE テーブル名 SET カラム = 値 WHERE 条件",
        desc: "既存の行を更新する。WHEREを忘れると全行が更新されるので注意！",
        example: "UPDATE employees SET salary = 600000 WHERE id = 1",
      },
      {
        name: "DELETE",
        syntax: "DELETE FROM テーブル名 WHERE 条件",
        desc: "条件に一致する行を削除する。WHEREを忘れると全行削除されるので注意！",
        example: "DELETE FROM employees WHERE id = 9",
      },
    ],
  },
  {
    category: "DDL（テーブル定義）",
    emoji: "🏗️",
    items: [
      {
        name: "CREATE TABLE",
        syntax: "CREATE TABLE テーブル名 (カラム名 型 制約, ...)",
        desc: "新しいテーブルを作成する。主な型：INTEGER / TEXT / REAL / BLOB。",
        example: "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, price INTEGER)",
      },
      {
        name: "制約",
        syntax: "PRIMARY KEY / NOT NULL / UNIQUE / DEFAULT / CHECK",
        desc: "カラムに制約を付ける。PRIMARY KEY=主キー, NOT NULL=NULL禁止, UNIQUE=重複禁止。",
        example: "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL)",
      },
      {
        name: "ALTER TABLE",
        syntax: "ALTER TABLE テーブル名 ADD COLUMN カラム名 型",
        desc: "既存テーブルにカラムを追加する。",
        example: "ALTER TABLE employees ADD COLUMN phone TEXT",
      },
      {
        name: "DROP TABLE",
        syntax: "DROP TABLE テーブル名",
        desc: "テーブルを削除する。データも全て消えるので注意。",
        example: "DROP TABLE old_employees",
      },
      {
        name: "CREATE VIEW",
        syntax: "CREATE VIEW ビュー名 AS SELECT ...",
        desc: "SELECT文に名前をつけて仮想テーブルを作成する。複雑なクエリの再利用に便利。",
        example: "CREATE VIEW dev_team AS SELECT * FROM employees WHERE dept_id = 2",
      },
    ],
  },
];
