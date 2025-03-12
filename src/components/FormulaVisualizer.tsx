function FormulaVisualizer({ ast }) {
  if (!ast) return null;

  // Render recursivo do nó
  const renderNode = (node) => {
    if (!node) return null;

    // Nó de variável
    if (node.type === "variable") {
      return (
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg shadow-sm">
          {node.name}
        </div>
      );
    }

    // Nó de operação
    if (node.type === "operation") {
      return (
        <div className="flex flex-col items-center">
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg shadow-sm mb-2">
            {node.operator}
          </div>
          <div
            className={`flex ${
              node.left ? "justify-between gap-4" : "justify-center"
            } items-start`}
          >
            {node.left && (
              <div className="flex flex-col items-center">
                <div className="h-6 w-px bg-gray-300"></div>
                {renderNode(node.left)}
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gray-300"></div>
              {renderNode(node.right)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-gray-700">
        Formula Visualization
      </h3>
      <div className="p-4 bg-white rounded-lg border border-gray-200 flex justify-center">
        {renderNode(ast)}
      </div>
    </div>
  );
}

export default FormulaVisualizer;
