export default function ResultTable({ results }) {
  if (!results || results.length === 0) {
    return <p className="no-result">結果なし（0件）</p>;
  }

  const { columns, values } = results[0];

  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell ?? "NULL"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
