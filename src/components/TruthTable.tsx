function TruthTable({ variables, ast, subExpressions, tableData }: any) {
  if (!tableData || tableData.length === 0) return null;

  // Para verificar tautologia/contradição, olhamos o valor do nó raiz (ast) em cada linha
  const trueRows = tableData.filter(
    (row: any) => row.valuesMap.get(ast) === true
  ).length;
  const isTautology = trueRows === tableData.length;
  const isContradiction = trueRows === 0;

  return (
    <div className="mb-6 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          Tabela Verdade (Completa)
        </h3>
        <div className="text-sm">
          {isTautology && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Tautologia
            </span>
          )}
          {isContradiction && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Contradição
            </span>
          )}
          {!isTautology && !isContradiction && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Contigência
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-center">
            <tr>
              {/* Colunas para cada variável */}
              {variables.map((v: number) => (
                <th
                  key={v}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {v}
                </th>
              ))}
              {/* Colunas para cada subexpressão */}
              {subExpressions.map((sub: any, idx: number) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {sub.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-50 text-center">
                {/* Valores das variáveis (T/F) */}
                {variables.map((v: string) => {
                  const val = row.assignment[v];
                  return (
                    <td key={v} className="px-4 py-3 text-sm font-mono">
                      <span
                        className={`px-2 py-1 rounded ${
                          val
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {val ? "T" : "F"}
                      </span>
                    </td>
                  );
                })}

                {/* Valores das subexpressões (T/F) */}
                {subExpressions.map((sub: any, idx: number) => {
                  const val = row.valuesMap.get(sub.node); // true ou false
                  return (
                    <td key={idx} className="px-4 py-3 text-sm font-mono">
                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          val
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {val ? "T" : "F"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TruthTable;
