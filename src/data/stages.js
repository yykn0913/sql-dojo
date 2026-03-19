// SQL資格（OSS-DB Silver / Oracle SQL）対応の問題構成
// verifyQuery がある問題はDML系（INSERT/UPDATE/DELETE）

export const PICK_COUNT = 4;

const EMPLOYEES_SETUP = `
  CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);
  INSERT INTO departments VALUES (1,'営業'),(2,'開発'),(3,'人事'),(4,'経理');

  CREATE TABLE employees (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL,
    dept_id INTEGER, salary INTEGER, age INTEGER,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
  );
  INSERT INTO employees VALUES
    (1,'田中',1,400000,32),(2,'鈴木',2,550000,28),
    (3,'佐藤',1,420000,35),(4,'山本',2,600000,40),
    (5,'伊藤',3,380000,27),(6,'渡辺',2,480000,31),
    (7,'中村',1,450000,29),(8,'高橋',4,390000,36);
`;

export const stages = [
  // ===== Stage 1: SELECT基本 =====
  {
    id: 1,
    title: "SELECT 基本",
    emoji: "🎯",
    description: "SELECT / WHERE / ORDER BY / LIMIT",
    setup: EMPLOYEES_SETUP,
    tableNames: ["employees"],
    problemPool: [
      {
        id: 1,
        question: "employees テーブルの全データを取得せよ",
        hint: "SELECT * FROM テーブル名",
        answer: "SELECT * FROM employees",
        explanation: "SELECT * は全カラムを取得する最も基本的な構文。",
      },
      {
        id: 2,
        question: "name と salary だけを取得せよ",
        hint: "SELECT カラム1, カラム2 FROM ...",
        answer: "SELECT name, salary FROM employees",
        explanation: "必要なカラムだけを指定することでデータ転送量を減らせる。",
      },
      {
        id: 3,
        question: "salary を降順に並べて全件取得せよ",
        hint: "ORDER BY カラム名 DESC",
        answer: "SELECT * FROM employees ORDER BY salary DESC",
        explanation: "DESC = 降順（大→小）。省略すると ASC（昇順）になる。",
      },
      {
        id: 4,
        question: "salary が低い順に name と salary を取得せよ",
        hint: "ORDER BY カラム名 ASC（ASCは省略可）",
        answer: "SELECT name, salary FROM employees ORDER BY salary ASC",
        explanation: "ASCは昇順（小→大）。ORDER BYのデフォルトはASC。",
      },
      {
        id: 5,
        question: "salary の高い順に上位3件を取得せよ",
        hint: "ORDER BY ... DESC LIMIT 数値",
        answer: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3",
        explanation: "LIMIT で取得件数を制限する。ORDER BY と組み合わせて上位N件を取得できる。",
      },
      {
        id: 6,
        question: "dept_id の重複なし一覧を取得せよ",
        hint: "SELECT DISTINCT カラム名 FROM ...",
        answer: "SELECT DISTINCT dept_id FROM employees",
        explanation: "DISTINCT は重複行を除去する。カラムの種類を調べる際によく使う。",
      },
      {
        id: 7,
        question: "name に「田」を含む社員を取得せよ",
        hint: "WHERE name LIKE '%田%'",
        answer: "SELECT * FROM employees WHERE name LIKE '%田%'",
        explanation: "LIKE演算子のワイルドカード：% は0文字以上の任意文字列。",
      },
      {
        id: 8,
        question: "age が 30 以上 35 以下の社員を取得せよ",
        hint: "WHERE age BETWEEN 値1 AND 値2",
        answer: "SELECT * FROM employees WHERE age BETWEEN 30 AND 35",
        explanation: "BETWEEN A AND B は A以上B以下（両端を含む）。",
      },
    ],
  },

  // ===== Stage 2: 関数・CASE式 =====
  {
    id: 2,
    title: "関数・CASE式",
    emoji: "⚙️",
    description: "文字列関数 / 数値関数 / CASE式",
    setup: EMPLOYEES_SETUP,
    tableNames: ["employees"],
    problemPool: [
      {
        id: 1,
        question: "name を大文字に変換して取得せよ（UPPER関数）",
        hint: "SELECT UPPER(name) FROM ...",
        answer: "SELECT UPPER(name) FROM employees",
        explanation: "UPPER() は文字列を大文字に変換。LOWER() で小文字にできる。",
      },
      {
        id: 2,
        question: "salary を 1.1 倍した値を name と一緒に取得せよ（列名は new_salary とすること）",
        hint: "SELECT name, salary * 1.1 AS new_salary FROM ...",
        answer: "SELECT name, salary * 1.1 AS new_salary FROM employees",
        explanation: "AS でカラムに別名（エイリアス）を付けられる。計算式も使える。",
      },
      {
        id: 3,
        question: "salary を 10000 で割った商（小数切り捨て）を取得せよ（CAST か ROUND を使う）",
        hint: "CAST(salary / 10000 AS INTEGER) または salary / 10000（整数除算）",
        answer: "SELECT name, CAST(salary / 10000 AS INTEGER) AS salary_man FROM employees",
        explanation: "CAST(値 AS 型) で型変換。整数同士の割り算は自動的に切り捨てになる場合もある。",
      },
      {
        id: 4,
        question: "dept_id が 1 なら「営業」、2 なら「開発」、それ以外は「その他」として name と一緒に取得せよ",
        hint: "CASE WHEN dept_id = 1 THEN '営業' WHEN ... ELSE '...' END",
        answer: "SELECT name, CASE WHEN dept_id = 1 THEN '営業' WHEN dept_id = 2 THEN '開発' ELSE 'その他' END AS dept_name FROM employees",
        explanation: "CASE式はSQLの条件分岐。CASE WHEN 条件 THEN 値 ... ELSE デフォルト END の形式。",
      },
      {
        id: 5,
        question: "salary が 500000 以上なら「高給」、そうでなければ「標準」として name と一緒に取得せよ",
        hint: "CASE WHEN salary >= 500000 THEN '高給' ELSE '標準' END",
        answer: "SELECT name, CASE WHEN salary >= 500000 THEN '高給' ELSE '標準' END AS grade FROM employees",
        explanation: "CASE式で数値の範囲に応じたラベル付けができる。分析系のSQLで頻出。",
      },
      {
        id: 6,
        question: "name の文字数を取得せよ（LENGTH関数）",
        hint: "SELECT name, LENGTH(name) FROM ...",
        answer: "SELECT name, LENGTH(name) AS name_len FROM employees",
        explanation: "LENGTH() は文字列の長さを返す。SQLiteでは文字数（マルチバイト対応）。",
      },
      {
        id: 7,
        question: "salary の絶対値を取得せよ（ABS関数）。全件対象",
        hint: "SELECT ABS(salary) FROM ...",
        answer: "SELECT name, ABS(salary) AS abs_salary FROM employees",
        explanation: "ABS() は絶対値を返す数値関数。負の値を扱うテーブルでよく使う。",
      },
      {
        id: 8,
        question: "dept_id が NULL の社員を取得せよ",
        hint: "WHERE dept_id IS NULL",
        answer: "SELECT * FROM employees WHERE dept_id IS NULL",
        explanation: "NULL との比較は = ではなく IS NULL / IS NOT NULL を使う。",
      },
    ],
  },

  // ===== Stage 3: 集計・グループ化 =====
  {
    id: 3,
    title: "集計・グループ化",
    emoji: "📊",
    description: "COUNT / SUM / AVG / GROUP BY / HAVING",
    setup: `
      CREATE TABLE sales (
        id INTEGER, rep_name TEXT, region TEXT, amount INTEGER, month INTEGER
      );
      INSERT INTO sales VALUES
        (1,'田中','東京',120000,1),(2,'鈴木','大阪',95000,1),
        (3,'田中','東京',140000,2),(4,'佐藤','東京',80000,2),
        (5,'鈴木','大阪',110000,2),(6,'佐藤','東京',95000,3),
        (7,'田中','名古屋',160000,3),(8,'山本','大阪',130000,3),
        (9,'山本','東京',90000,1),(10,'佐藤','名古屋',75000,1);
    `,
    tableNames: ["sales"],
    problemPool: [
      {
        id: 1,
        question: "売上の総件数を取得せよ",
        hint: "SELECT COUNT(*) FROM ...",
        answer: "SELECT COUNT(*) FROM sales",
        explanation: "COUNT(*) は NULL を含む全行数を返す。COUNT(カラム名) はNULLを除く。",
      },
      {
        id: 2,
        question: "全売上の合計 amount を取得せよ",
        hint: "SELECT SUM(カラム名) FROM ...",
        answer: "SELECT SUM(amount) FROM sales",
        explanation: "SUM() は合計値を返す集計関数。NULLは無視される。",
      },
      {
        id: 3,
        question: "売上の最大値・最小値・平均値を1行で取得せよ",
        hint: "MAX(), MIN(), AVG() を並べる",
        answer: "SELECT MAX(amount), MIN(amount), AVG(amount) FROM sales",
        explanation: "複数の集計関数を1つのSELECTに並べられる。",
      },
      {
        id: 4,
        question: "担当者ごとの売上合計を rep_name 順に取得せよ",
        hint: "GROUP BY rep_name + SUM + ORDER BY",
        answer: "SELECT rep_name, SUM(amount) FROM sales GROUP BY rep_name ORDER BY rep_name",
        explanation: "GROUP BY で行をグループ化し、集計関数を各グループに適用する。",
      },
      {
        id: 5,
        question: "地域ごとの売上件数と平均 amount を取得せよ",
        hint: "GROUP BY region + COUNT + AVG",
        answer: "SELECT region, COUNT(*), AVG(amount) FROM sales GROUP BY region",
        explanation: "GROUP BY に複数の集計関数を組み合わせられる。",
      },
      {
        id: 6,
        question: "月ごとの売上合計を月順に取得せよ",
        hint: "GROUP BY month + SUM + ORDER BY month",
        answer: "SELECT month, SUM(amount) FROM sales GROUP BY month ORDER BY month",
        explanation: "GROUP BY と ORDER BY は独立して指定する。",
      },
      {
        id: 7,
        question: "売上合計が 250000 を超える担当者の名前と合計を取得せよ",
        hint: "GROUP BY + HAVING SUM(...) > 250000",
        answer: "SELECT rep_name, SUM(amount) FROM sales GROUP BY rep_name HAVING SUM(amount) > 250000",
        explanation: "HAVING は GROUP BY 後の条件指定。WHERE はグループ化前、HAVING はグループ化後に使う。",
      },
      {
        id: 8,
        question: "東京での売上件数が2件以上の担当者を取得せよ",
        hint: "WHERE region = '東京' + GROUP BY + HAVING COUNT(*) >= 2",
        answer: "SELECT rep_name, COUNT(*) FROM sales WHERE region = '東京' GROUP BY rep_name HAVING COUNT(*) >= 2",
        explanation: "WHERE→GROUP BY→HAVING の順で処理される。WHERE で先に絞り込むと効率的。",
      },
    ],
  },

  // ===== Stage 4: テーブル結合 =====
  {
    id: 4,
    title: "テーブル結合（JOIN）",
    emoji: "🔗",
    description: "INNER JOIN / LEFT JOIN / 複数テーブル結合",
    setup: EMPLOYEES_SETUP,
    tableNames: ["departments", "employees"],
    problemPool: [
      {
        id: 1,
        question: "社員の name と所属する dept_name を取得せよ（所属なしは除く）",
        hint: "INNER JOIN departments ON employees.dept_id = departments.dept_id",
        answer: "SELECT employees.name, departments.dept_name FROM employees INNER JOIN departments ON employees.dept_id = departments.dept_id",
        explanation: "INNER JOIN は両方のテーブルに一致するレコードだけを返す。最も基本的なJOIN。",
      },
      {
        id: 2,
        question: "全社員の name と dept_name を取得せよ（所属なしは NULL で表示）",
        hint: "LEFT JOIN を使う",
        answer: "SELECT employees.name, departments.dept_name FROM employees LEFT JOIN departments ON employees.dept_id = departments.dept_id",
        explanation: "LEFT JOIN は左テーブルの全行を保持し、一致しない右テーブルの値はNULLになる。",
      },
      {
        id: 3,
        question: "部門ごとの社員数を dept_name と一緒に取得せよ（社員0人の部門も含む）",
        hint: "departments を左テーブルにした LEFT JOIN + GROUP BY",
        answer: "SELECT departments.dept_name, COUNT(employees.id) FROM departments LEFT JOIN employees ON departments.dept_id = employees.dept_id GROUP BY departments.dept_name",
        explanation: "社員0人の部門を含めるには departments を LEFT JOIN の左側に置く。COUNT(employees.id) はNULLを除くので0になる。",
      },
      {
        id: 4,
        question: "「開発」部門の社員の name と salary を取得せよ",
        hint: "INNER JOIN + WHERE dept_name = '開発'",
        answer: "SELECT employees.name, employees.salary FROM employees INNER JOIN departments ON employees.dept_id = departments.dept_id WHERE departments.dept_name = '開発'",
        explanation: "JOIN後にWHEREで絞り込める。結合と絞り込みを組み合わせる頻出パターン。",
      },
      {
        id: 5,
        question: "部門ごとの平均 salary を dept_name と一緒に取得せよ",
        hint: "INNER JOIN + GROUP BY departments.dept_name + AVG",
        answer: "SELECT departments.dept_name, AVG(employees.salary) FROM departments INNER JOIN employees ON departments.dept_id = employees.dept_id GROUP BY departments.dept_name",
        explanation: "JOINした後でGROUP BYできる。JOIN→GROUP BY→集計 の流れ。",
      },
      {
        id: 6,
        question: "社員ごとの name・dept_name・salary を salary 降順で取得せよ",
        hint: "INNER JOIN + ORDER BY salary DESC",
        answer: "SELECT employees.name, departments.dept_name, employees.salary FROM employees INNER JOIN departments ON employees.dept_id = departments.dept_id ORDER BY employees.salary DESC",
        explanation: "JOIN後のORDER BYはどちらのテーブルのカラムでも指定できる。",
      },
    ],
  },

  // ===== Stage 5: サブクエリ・WITH句 =====
  {
    id: 5,
    title: "サブクエリ・WITH句",
    emoji: "🧠",
    description: "相関サブクエリ / IN・EXISTS / CTE",
    setup: `
      CREATE TABLE departments (dept_id INTEGER, dept_name TEXT);
      INSERT INTO departments VALUES (1,'営業'),(2,'開発'),(3,'人事');

      CREATE TABLE employees (id INTEGER, name TEXT, dept_id INTEGER, salary INTEGER);
      INSERT INTO employees VALUES
        (1,'田中',1,400000),(2,'鈴木',2,550000),(3,'佐藤',1,420000),
        (4,'山本',2,600000),(5,'伊藤',3,380000),(6,'渡辺',2,480000),(7,'中村',1,450000);

      CREATE TABLE projects (proj_id INTEGER, proj_name TEXT, dept_id INTEGER, cost INTEGER);
      INSERT INTO projects VALUES
        (1,'Webリニューアル',2,3000000),(2,'営業支援ツール',1,1500000),
        (3,'HR管理システム',3,2000000),(4,'データ基盤構築',2,5000000),
        (5,'新規開拓キャンペーン',1,800000);
    `,
    tableNames: ["departments", "employees", "projects"],
    problemPool: [
      {
        id: 1,
        question: "全社員の平均 salary より高い社員の name と salary を取得せよ",
        hint: "WHERE salary > (SELECT AVG(salary) FROM employees)",
        answer: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)",
        explanation: "スカラサブクエリ：WHERE句の中でSELECTを使い、1つの値と比較する基本パターン。",
      },
      {
        id: 2,
        question: "最も salary が高い社員の name を取得せよ（サブクエリを使え）",
        hint: "WHERE salary = (SELECT MAX(salary) FROM employees)",
        answer: "SELECT name FROM employees WHERE salary = (SELECT MAX(salary) FROM employees)",
        explanation: "MAX()をサブクエリで使うことで、ORDER BY + LIMIT 1 の代わりに書ける。",
      },
      {
        id: 3,
        question: "プロジェクトを持つ部門の dept_name を重複なしで取得せよ（IN句を使え）",
        hint: "WHERE dept_id IN (SELECT dept_id FROM projects)",
        answer: "SELECT DISTINCT dept_name FROM departments WHERE dept_id IN (SELECT dept_id FROM projects)",
        explanation: "IN (サブクエリ) で「一覧に含まれる」条件を書ける。EXISTS を使っても同様の結果が得られる。",
      },
      {
        id: 4,
        question: "プロジェクトを1件も持たない部門の dept_name を取得せよ（NOT IN を使え）",
        hint: "WHERE dept_id NOT IN (SELECT dept_id FROM projects)",
        answer: "SELECT dept_name FROM departments WHERE dept_id NOT IN (SELECT dept_id FROM projects)",
        explanation: "NOT IN は「一覧に含まれない」行を返す。ただしサブクエリにNULLがあると結果が空になるので注意。",
      },
      {
        id: 5,
        question: "WITH句で部門別平均給与を定義し、平均が 450000 を超える dept_id と平均給与を取得せよ",
        hint: "WITH avg_sal AS (SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id) SELECT ...",
        answer: "WITH avg_sal AS (SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id) SELECT dept_id, avg_salary FROM avg_sal WHERE avg_salary > 450000",
        explanation: "WITH句（CTE: Common Table Expression）でサブクエリに名前をつけて再利用できる。複雑なクエリの可読性が大幅に向上する。",
      },
      {
        id: 6,
        question: "WITH句で各部門のプロジェクト合計コストを集計し、dept_name と合計コストを取得せよ",
        hint: "WITH proj_cost AS (...) SELECT dept_name, total FROM proj_cost JOIN departments ...",
        answer: "WITH proj_cost AS (SELECT dept_id, SUM(cost) AS total FROM projects GROUP BY dept_id) SELECT departments.dept_name, proj_cost.total FROM proj_cost INNER JOIN departments ON proj_cost.dept_id = departments.dept_id",
        explanation: "CTEをJOINの元テーブルとして使える。集計結果と他テーブルを組み合わせる典型パターン。",
      },
    ],
  },

  // ===== Stage 6: データ操作（DML）=====
  {
    id: 6,
    title: "データ操作（DML）",
    emoji: "✏️",
    description: "INSERT / UPDATE / DELETE",
    setup: `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL,
        category TEXT, price INTEGER, stock INTEGER
      );
      INSERT INTO products VALUES
        (1,'ノートPC','電子機器',120000,10),
        (2,'マウス','電子機器',3000,50),
        (3,'デスク','家具',45000,5),
        (4,'チェア','家具',38000,8),
        (5,'モニター','電子機器',55000,15);
    `,
    tableNames: ["products"],
    problemPool: [
      {
        id: 1,
        question: "products に (6, 'キーボード', '電子機器', 8000, 30) を挿入せよ",
        hint: "INSERT INTO products VALUES (...)",
        answer: "INSERT INTO products VALUES (6, 'キーボード', '電子機器', 8000, 30)",
        verifyQuery: "SELECT * FROM products WHERE id = 6",
        explanation: "INSERT INTO テーブル名 VALUES (値1, 値2, ...) で行を追加する。カラム順に値を指定する。",
      },
      {
        id: 2,
        question: "id=3 の商品の price を 48000 に変更せよ",
        hint: "UPDATE products SET price = ... WHERE id = ...",
        answer: "UPDATE products SET price = 48000 WHERE id = 3",
        verifyQuery: "SELECT id, name, price FROM products WHERE id = 3",
        explanation: "UPDATE テーブル名 SET カラム = 値 WHERE 条件。WHERE を忘れると全行が更新されるので注意！",
      },
      {
        id: 3,
        question: "stock が 5 以下の商品の stock を 20 に更新せよ",
        hint: "UPDATE products SET stock = 20 WHERE stock <= 5",
        answer: "UPDATE products SET stock = 20 WHERE stock <= 5",
        verifyQuery: "SELECT id, name, stock FROM products ORDER BY id",
        explanation: "WHERE条件に一致する複数行を一度に更新できる。",
      },
      {
        id: 4,
        question: "category が「家具」の商品を全て削除せよ",
        hint: "DELETE FROM products WHERE category = '...'",
        answer: "DELETE FROM products WHERE category = '家具'",
        verifyQuery: "SELECT * FROM products ORDER BY id",
        explanation: "DELETE FROM テーブル名 WHERE 条件。WHERE なしで全削除になるので必ず条件を確認する。",
      },
      {
        id: 5,
        question: "id=2 の商品の price を 2500 に、stock を 60 に同時に更新せよ",
        hint: "UPDATE ... SET price = ..., stock = ... WHERE ...",
        answer: "UPDATE products SET price = 2500, stock = 60 WHERE id = 2",
        verifyQuery: "SELECT id, name, price, stock FROM products WHERE id = 2",
        explanation: "SET句でカンマ区切りにすると複数カラムを同時に更新できる。",
      },
      {
        id: 6,
        question: "price が 100000 を超える商品を削除せよ",
        hint: "DELETE FROM products WHERE price > 100000",
        answer: "DELETE FROM products WHERE price > 100000",
        verifyQuery: "SELECT * FROM products ORDER BY id",
        explanation: "DELETE は条件に一致する行を全て削除する。削除前にSELECTで対象確認するのがベストプラクティス。",
      },
    ],
  },

  // ===== Stage 7: テーブル定義（DDL）=====
  {
    id: 7,
    title: "テーブル定義（DDL）",
    emoji: "🏗️",
    description: "CREATE TABLE / ALTER TABLE / VIEW",
    setup: `
      CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        age INTEGER,
        created_at TEXT DEFAULT '2024-01-01'
      );
      INSERT INTO customers VALUES (1,'山田','yamada@mail.com',30,'2024-01-15');
      INSERT INTO customers VALUES (2,'田中','tanaka@mail.com',25,'2024-02-01');
      INSERT INTO customers VALUES (3,'鈴木','suzuki@mail.com',40,'2024-03-10');
    `,
    tableNames: ["customers"],
    problemPool: [
      {
        id: 1,
        question: "id (INTEGER PRIMARY KEY), title (TEXT NOT NULL), price (INTEGER) の3カラムを持つ books テーブルを作成せよ",
        hint: "CREATE TABLE books (id INTEGER PRIMARY KEY, ...)",
        answer: "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, price INTEGER)",
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='books'",
        explanation: "CREATE TABLE でテーブルを定義する。PRIMARY KEY（主キー）と NOT NULL制約はよく使う制約。",
      },
      {
        id: 2,
        question: "customers テーブルに phone TEXT カラムを追加せよ",
        hint: "ALTER TABLE customers ADD COLUMN phone TEXT",
        answer: "ALTER TABLE customers ADD COLUMN phone TEXT",
        verifyQuery: "SELECT name FROM pragma_table_info('customers') WHERE name='phone'",
        explanation: "ALTER TABLE テーブル名 ADD COLUMN カラム名 型 でカラムを追加できる。",
      },
      {
        id: 3,
        question: "age が 30 以上の customers を返すビュー senior_customers を作成せよ",
        hint: "CREATE VIEW senior_customers AS SELECT ...",
        answer: "CREATE VIEW senior_customers AS SELECT * FROM customers WHERE age >= 30",
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='view' AND name='senior_customers'",
        explanation: "VIEW はSELECT文に名前をつけたもの。複雑なクエリを再利用しやすくなる。",
      },
      {
        id: 4,
        question: "id (INTEGER PRIMARY KEY), order_id (INTEGER NOT NULL), customer_id (INTEGER), amount (INTEGER CHECK(amount > 0)) を持つ order_items テーブルを作成せよ",
        hint: "CHECK制約は CHECK(条件) の形式",
        answer: "CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, customer_id INTEGER, amount INTEGER CHECK(amount > 0))",
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='order_items'",
        explanation: "CHECK制約でカラムの値に条件を設定できる。amount > 0 なら負の値を防げる。",
      },
      {
        id: 5,
        question: "customers テーブルの age が NULL の行を取得せよ",
        hint: "WHERE age IS NULL",
        answer: "SELECT * FROM customers WHERE age IS NULL",
        verifyQuery: null,
        explanation: "IS NULL / IS NOT NULL でNULLチェックする。= NULL は機能しないので注意。",
      },
      {
        id: 6,
        question: "customers テーブルを削除せよ",
        hint: "DROP TABLE テーブル名",
        answer: "DROP TABLE customers",
        verifyQuery: "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='customers'",
        explanation: "DROP TABLE でテーブルを完全に削除する。元に戻せないので本番では慎重に。",
      },
    ],
  },

  // ===== Stage 8: 総合実践（高難度） =====
  {
    id: 8,
    title: "総合実践（上級）",
    emoji: "🔥",
    description: "JOIN・集計・サブクエリ・DMLの複合問題",
    setup: `
      CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL, budget INTEGER);
      INSERT INTO departments VALUES (1,'営業',5000000),(2,'開発',8000000),(3,'人事',3000000),(4,'経理',4000000);

      CREATE TABLE employees (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL,
        dept_id INTEGER, salary INTEGER, age INTEGER, hired_year INTEGER
      );
      INSERT INTO employees VALUES
        (1,'田中',1,400000,32,2018),(2,'鈴木',2,550000,28,2020),
        (3,'佐藤',1,420000,35,2015),(4,'山本',2,600000,40,2012),
        (5,'伊藤',3,380000,27,2021),(6,'渡辺',2,480000,31,2019),
        (7,'中村',1,450000,29,2020),(8,'高橋',4,390000,36,2014),
        (9,'小林',2,520000,33,2017),(10,'加藤',3,360000,25,2022);

      CREATE TABLE projects (
        proj_id INTEGER PRIMARY KEY, proj_name TEXT, dept_id INTEGER,
        cost INTEGER, status TEXT
      );
      INSERT INTO projects VALUES
        (1,'Webリニューアル',2,3000000,'完了'),
        (2,'営業支援ツール',1,1500000,'進行中'),
        (3,'HR管理システム',3,2000000,'完了'),
        (4,'データ基盤構築',2,5000000,'進行中'),
        (5,'新規開拓キャンペーン',1,800000,'完了'),
        (6,'経費精算システム',4,1200000,'進行中'),
        (7,'AIチャットボット',2,4000000,'計画中');

      CREATE TABLE evaluations (
        id INTEGER PRIMARY KEY, emp_id INTEGER, year INTEGER, score INTEGER
      );
      INSERT INTO evaluations VALUES
        (1,1,2023,3),(2,2,2023,5),(3,3,2023,4),(4,4,2023,5),
        (5,5,2023,2),(6,6,2023,4),(7,7,2023,3),(8,8,2023,3),
        (9,9,2023,4),(10,10,2023,2),
        (11,1,2022,3),(12,2,2022,4),(13,4,2022,5),(14,9,2022,3);
    `,
    tableNames: ["departments", "employees", "projects", "evaluations"],
    problemPool: [
      {
        id: 1,
        question: "部門ごとの社員数・平均給与・最高給与を求め、平均給与の高い順に表示せよ",
        hint: "JOIN + GROUP BY + AVG + MAX + ORDER BY",
        answer: "SELECT d.dept_name, COUNT(e.id) AS emp_count, AVG(e.salary) AS avg_salary, MAX(e.salary) AS max_salary FROM departments d LEFT JOIN employees e ON d.dept_id = e.dept_id GROUP BY d.dept_id, d.dept_name ORDER BY avg_salary DESC",
        explanation: "LEFT JOINで社員0人の部門も含め、GROUP BYで集計。ORDER BYに集計結果のエイリアスを使う書き方。",
      },
      {
        id: 2,
        question: "2023年の評価スコアが部門平均を上回る社員の name・dept_name・score を取得せよ",
        hint: "JOIN + WHERE score > (サブクエリで部門平均を取得)",
        answer: "SELECT e.name, d.dept_name, ev.score FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id INNER JOIN evaluations ev ON e.id = ev.emp_id WHERE ev.year = 2023 AND ev.score > (SELECT AVG(score) FROM evaluations WHERE year = 2023)",
        explanation: "複数JOINとスカラサブクエリの組み合わせ。サブクエリで全体平均を求めて比較する。",
      },
      {
        id: 3,
        question: "WITH句を使い、部門ごとのプロジェクト総コストを集計し、予算（budget）を超えている部門の dept_name・budget・総コストを取得せよ",
        hint: "WITH proj_total AS (...) SELECT ... FROM proj_total JOIN departments ... WHERE 総コスト > budget",
        answer: "WITH proj_total AS (SELECT dept_id, SUM(cost) AS total_cost FROM projects GROUP BY dept_id) SELECT d.dept_name, d.budget, pt.total_cost FROM proj_total pt INNER JOIN departments d ON pt.dept_id = d.dept_id WHERE pt.total_cost > d.budget",
        explanation: "WITH句で集計してから JOIN + WHERE で絞り込む。budget超過の部門を一目で把握できるパターン。",
      },
      {
        id: 4,
        question: "2020年以降に入社した社員のうち、2023年の評価スコアが4以上の社員の name と score を取得せよ",
        hint: "JOIN evaluations + WHERE hired_year >= 2020 AND score >= 4 AND year = 2023",
        answer: "SELECT e.name, ev.score FROM employees e INNER JOIN evaluations ev ON e.id = ev.emp_id WHERE e.hired_year >= 2020 AND ev.year = 2023 AND ev.score >= 4",
        explanation: "JOINに加え複数のWHERE条件を組み合わせる。条件が増えるほど AND で追加していく。",
      },
      {
        id: 5,
        question: "各社員について、直近2年間（2022・2023年）の評価スコアの合計を name と一緒に取得し、合計スコアの高い順に表示せよ（評価が1年しかない社員も含む）",
        hint: "LEFT JOIN evaluations + WHERE year IN (2022, 2023) + GROUP BY + SUM + ORDER BY",
        answer: "SELECT e.name, SUM(ev.score) AS total_score FROM employees e LEFT JOIN evaluations ev ON e.id = ev.emp_id AND ev.year IN (2022, 2023) GROUP BY e.id, e.name ORDER BY total_score DESC",
        explanation: "LEFT JOINの ON句に year条件を書くことで、評価がない社員もNULL(=0扱い)で残せる。WHERE に書くと評価なし社員が除外されてしまう。",
      },
      {
        id: 6,
        question: "「進行中」のプロジェクトを持つ部門に所属する社員の中で、給与が500000以上の社員の name・salary・dept_name を取得せよ",
        hint: "WHERE dept_id IN (SELECT dept_id FROM projects WHERE status = '進行中') AND salary >= 500000",
        answer: "SELECT e.name, e.salary, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id WHERE e.dept_id IN (SELECT dept_id FROM projects WHERE status = '進行中') AND e.salary >= 500000",
        explanation: "IN サブクエリで条件に合う dept_id を絞り込んでから JOIN + WHERE で絞る複合パターン。",
      },
      {
        id: 7,
        question: "WITH句で社員ごとの2023年スコアを定義し、スコアが5の社員の salary を 10% 増やす UPDATE 文を書け",
        hint: "通常の UPDATE + WHERE id IN (SELECT ... FROM evaluations WHERE ...)",
        answer: "UPDATE employees SET salary = salary * 1.1 WHERE id IN (SELECT emp_id FROM evaluations WHERE year = 2023 AND score = 5)",
        verifyQuery: "SELECT id, name, salary FROM employees WHERE id IN (SELECT emp_id FROM evaluations WHERE year = 2023 AND score = 5)",
        explanation: "UPDATE の WHERE にサブクエリを使うパターン。評価結果に応じた給与更新など実務でよく使う。",
      },
      {
        id: 8,
        question: "部門ごとの平均給与をWITH句で定義し、自部門の平均給与より高い社員の name・dept_name・salary・部門平均給与を取得せよ",
        hint: "WITH dept_avg AS (SELECT dept_id, AVG(salary) ...) SELECT ... JOIN dept_avg ON ... WHERE salary > avg_salary",
        answer: "WITH dept_avg AS (SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id) SELECT e.name, d.dept_name, e.salary, da.avg_salary FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id INNER JOIN dept_avg da ON e.dept_id = da.dept_id WHERE e.salary > da.avg_salary",
        explanation: "WITH句で部門平均を集計し、それをJOINして各社員の給与と比較する。相関サブクエリより可読性が高い。",
      },
    ],
  },
];
