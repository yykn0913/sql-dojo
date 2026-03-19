import { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

export function useSqlJs() {
  const [SQL, setSQL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initSqlJs({ locateFile: () => sqlWasmUrl })
      .then((sql) => { setSQL(sql); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  // SELECT系：クエリを実行して結果を返す
  function runQuery(setupSql, querySql) {
    if (!SQL) return { error: "SQLエンジン未初期化" };
    try {
      const db = new SQL.Database();
      db.run(setupSql);
      const results = db.exec(querySql);
      db.close();
      return { results };
    } catch (e) {
      return { error: e.message };
    }
  }

  // DML系：ユーザーのSQLを実行後、verifyQueryで結果を確認する
  function runDML(setupSql, userSql, verifySql) {
    if (!SQL) return { error: "SQLエンジン未初期化" };
    try {
      const db = new SQL.Database();
      db.run(setupSql);
      db.run(userSql);
      const results = db.exec(verifySql);
      db.close();
      return { results };
    } catch (e) {
      return { error: e.message };
    }
  }

  function runExpected(setupSql, expectedSql, verifySql = null) {
    if (!SQL) return null;
    try {
      const db = new SQL.Database();
      db.run(setupSql);
      if (verifySql) {
        db.run(expectedSql);
        const results = db.exec(verifySql);
        db.close();
        return results;
      } else {
        const results = db.exec(expectedSql);
        db.close();
        return results;
      }
    } catch {
      return null;
    }
  }

  return { SQL, loading, error, runQuery, runDML, runExpected };
}
