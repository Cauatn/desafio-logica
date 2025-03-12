function FormulaDisplay({ formula, ast }: any) {
  if (!formula || !ast) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <h3 className="text-sm font-medium mb-2 text-gray-700">
        Estrutura da fórmula
      </h3>
      <div className="p-2 bg-white rounded border border-gray-200 font-mono text-sm">
        {JSON.stringify(ast, null, 2)}
      </div>
    </div>
  );
}

export default FormulaDisplay;
