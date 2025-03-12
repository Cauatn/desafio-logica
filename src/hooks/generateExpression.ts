function evaluateAllSubExpressions(ast: any, assignment: any) {
  const valuesMap = new Map();

  function evalNode(node) {
    if (!node) return false;

    // Variável
    if (node.type === "variable") {
      const val = assignment[node.name];
      valuesMap.set(node, val);
      return val;
    }

    // Negação
    if (node.operator === "¬") {
      const val = !evalNode(node.right);
      valuesMap.set(node, val);
      return val;
    }

    // Operações binárias
    const leftVal = evalNode(node.left);
    const rightVal = evalNode(node.right);
    let result = false;

    switch (node.operator) {
      case "∧":
        result = leftVal && rightVal;
        break;
      case "∨":
        result = leftVal || rightVal;
        break;
      case "→":
        result = !leftVal || rightVal;
        break;
      case "↔":
        result = leftVal === rightVal;
        break;
      default:
        result = false;
    }

    valuesMap.set(node, result);
    return result;
  }

  evalNode(ast);
  return valuesMap;
}

function collectSubExpressions(ast: any) {
  const subExpressions: { node: any; label: any }[] = [];

  function traverse(node: any) {
    if (!node) return "";

    // Se for variável, só retorna o nome, mas não adiciona ao array
    if (node.type === "variable") {
      return node.name;
    }

    // Se for operação unária (¬)
    if (node.operator === "¬") {
      const rightLabel = traverse(node.right);
      const label = `¬(${rightLabel})`;
      subExpressions.push({ node, label });
      return label;
    }

    // Se for operação binária (∧, ∨, →, ↔)
    const leftLabel = traverse(node.left);
    const rightLabel = traverse(node.right);
    const label = `(${leftLabel} ${node.operator} ${rightLabel})`;
    subExpressions.push({ node, label });
    return label;
  }

  traverse(ast);
  return subExpressions;
}

function generateTruthTableWithSubExpressions(variables: any, ast: any) {
  const subExpressions = collectSubExpressions(ast);
  const table = [];
  const count = Math.pow(2, variables.length);

  for (let i = 0; i < count; i++) {
    // Monta a atribuição (ex.: P=true, Q=false, etc.)
    const assignment = {};
    variables.forEach((v: any, idx: any) => {
      assignment[v] = Boolean((i >> (variables.length - 1 - idx)) & 1);
    });

    // Avalia todas as subexpressões para essa atribuição
    const valuesMap = evaluateAllSubExpressions(ast, assignment);

    // Salva no array da tabela
    table.push({ assignment, valuesMap });
  }

  return { subExpressions, table };
}

export default generateTruthTableWithSubExpressions;
