import React, { useState } from "react";
import TreeVisualization from "./components/TreeVisualization";
import CheckIcon from "../../components/CheckIcon";
import { XIcon } from "../../components/XIcon";
import { Link } from "react-router";

interface Node {
  id: number;
  formula: string;
  parent: number | null;
  rule?: string;
  children: Node[];
}

const TableauAnalyzer: React.FC = () => {
  const [inputFormula, setInputFormula] = useState<string>("");
  const [rootNode, setRootNode] = useState<Node | null>(null);
  const [isFormulaValid, setIsFormulaValid] = useState<boolean>(true);

  let nodeId = 0;
  const expandedFormulas = new Set<string>();

  const createNode = (
    formula: string,
    parent: number | null,
    rule?: string
  ): Node => {
    return { id: nodeId++, formula, parent, rule, children: [] };
  };

  const removeOuterParentheses = (formula: string): string => {
    if (formula.startsWith("(") && formula.endsWith(")")) {
      let counter = 0;
      for (let i = 0; i < formula.length; i++) {
        if (formula[i] === "(") counter++;
        else if (formula[i] === ")") counter--;
        if (counter === 0 && i < formula.length - 1) {
          return formula;
        }
      }
      return formula.slice(1, -1);
    }
    return formula;
  };

  const splitFormula = (formula: string): { left: string; right: string } => {
    let counter = 0;
    for (let i = 0; i < formula.length; i++) {
      if (formula[i] === "(") counter++;
      else if (formula[i] === ")") counter--;
      else if (
        (formula[i] === "^" ||
          formula[i] === "V" ||
          formula[i] === ">" ||
          formula[i] === "#") && // Considera o operador temporário
        counter === 0
      ) {
        return {
          left: formula.slice(0, i).trim(),
          right: formula.slice(i + 1).trim(),
        };
      }
    }
    return { left: formula, right: "" };
  };

  const buildTableau = (curFormula: string, parentNode: Node | null): Node => {
    curFormula = removeOuterParentheses(curFormula.replace(/\s+/g, ""));
    if (!curFormula) return createNode("Erro", parentNode?.id || null, "Erro");

    if (expandedFormulas.has(curFormula)) {
      return createNode(curFormula, parentNode?.id || null, "Já expandido");
    }
    let node = createNode(curFormula, parentNode?.id || null, "");
    expandedFormulas.add(curFormula);

    const isLiteral =
      !curFormula.includes("^") &&
      !curFormula.includes("V") &&
      !curFormula.includes(">") &&
      !curFormula.includes("<>") &&
      (curFormula.length === 1 ||
        (curFormula.startsWith("~") && curFormula.length === 2));

    if (isLiteral) {
      node.rule = "Literal";
      return node;
    }

    if (curFormula.startsWith("~~")) {
      node.rule = "R5";
      const newFormula = curFormula.slice(2);
      node.children.push(buildTableau(newFormula, node));
      return node;
    }

    if (curFormula.startsWith("~(")) {
      const innerFormula = curFormula.slice(2, -1); // Remove "~(" e ")"

      // Caso a fórmula interna também comece com "~", elimine a negação redundante
      if (innerFormula.startsWith("~")) {
        const innerInnerFormula = innerFormula.slice(1); // Remove o primeiro "~"

        // Cria um nó para representar a eliminação da negação
        const eliminationNode = createNode(
          `Eliminação de ~: ~${innerFormula}`,
          parentNode?.id || null,
          "Eliminação de Negação"
        );
        node.children.push(eliminationNode); // Adiciona o nó da eliminação ao nó pai

        // Reaplica a lógica de tableau para a fórmula interna sem o "~"
        return buildTableau(innerInnerFormula, node);
      }

      if (innerFormula.includes("<>")) {
        node.rule = "R4"; // Regra para bicondicional negado

        const tempFormula = innerFormula.replace("<>", "#"); // Substitui <>, que é tratado como #
        const { left, right } = splitFormula(tempFormula);

        // Criando dois nós separados para ~A ^ B e A ^ ~B
        node.children.push(buildTableau(`~${left} ^ ${right}`, node)); // ~A ^ B
        node.children.push(buildTableau(`${left} ^ ~${right}`, node)); // A ^ ~B

        return node;
      }

      // Se não for um caso de "~~" ou de um bicondicional, o código continua com a lógica normal
      if (innerFormula.includes("^")) {
        node.rule = "DM^";
        const { left, right } = splitFormula(innerFormula);
        node.children.push(buildTableau(`~${left} V ~${right}`, node));
        return node;
      }

      if (innerFormula.includes("V")) {
        node.rule = "DMV";
        const { left, right } = splitFormula(innerFormula);
        node.children.push(buildTableau(`~${left}`, node));
        node.children.push(buildTableau(`~${right}`, node));
        return node;
      }

      if (innerFormula.includes(">")) {
        node.rule = "DM>";
        const { left, right } = splitFormula(innerFormula);
        node.children.push(buildTableau(`${left} ^ ~${right}`, node));
        return node;
      }
    }

    if (curFormula.includes("<>") && !curFormula.startsWith("~")) {
      node.rule = "R4";

      const tempFormula = curFormula.replace("<>", "#");
      const { left, right } = splitFormula(tempFormula);

      node.children.push(buildTableau(`${left} ^ ${right}`, node));
      node.children.push(buildTableau(`~${left} ^ ~${right}`, node));

      return node;
    }

    if (curFormula.includes(">") && !curFormula.startsWith("~")) {
      node.rule = "R3";
      const { left, right } = splitFormula(curFormula);

      node.children.push(buildTableau(`~${left}`, node));
      node.children.push(buildTableau(right, node));

      return node;
    }

    if (curFormula.includes("^")) {
      node.rule = "R1";
      const { left, right } = splitFormula(curFormula);
      let leftNode = buildTableau(left, node);
      let rightNode = buildTableau(right, leftNode);
      leftNode.children.push(rightNode);
      node.children.push(leftNode);
      return node;
    }

    if (curFormula.includes("V")) {
      node.rule = "R2";
      const { left, right } = splitFormula(curFormula);
      node.children.push(buildTableau(left, node));
      node.children.push(buildTableau(right, node));
      return node;
    }

    return node;
  };

  const handleStart = () => {
    try {
      expandedFormulas.clear();
      const root = buildTableau(inputFormula.replace(/\s+/g, ""), null);
      setRootNode(root);
      setIsFormulaValid(true);
    } catch (error) {
      console.error("Error processing formula:", error);
      setIsFormulaValid(false);
    }
  };

  const insertSymbol = (symbol: string) => {
    setInputFormula((prev) => prev + symbol);
  };

  const symbols = [
    { symbol: "^", name: "E" },
    { symbol: "V", name: "OU" },
    { symbol: "~", name: "NÃO" },
    { symbol: ">", name: "IMPLICA" },
    { symbol: "(", name: "ABRIR" },
    { symbol: ")", name: "FECHAR" },
  ];

  const exampleFormulas = [
    { name: "Conjunção simples", formula: "A ^ B" },
    { name: "Implicação", formula: "(A > B)" },
    { name: "Disjunção", formula: "P V Q" },
    { name: "Tautologia", formula: "A V ~A" },
    { name: "Contradição", formula: "A ^ ~A" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Analisador do Tableau
            </h1>
            <p className="text-gray-600 mb-6">
              Insira uma fórmula lógica e visualize o tableau gerado em forma de
              uma árvore.
            </p>
          </div>
          <Link className="p-4 bg-emerald-400 rounded-sm" to={"/"}>
            VOLTAR
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={inputFormula}
            onChange={(e) => setInputFormula(e.target.value)}
            placeholder="Digite a fórmula aqui"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-400 focus:ring focus:ring-indigo-300"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Símbolos Lógicos
          </h3>
          <div className="flex flex-wrap gap-2">
            {symbols.map((sym) => (
              <button
                key={sym.symbol}
                onClick={() => insertSymbol(sym.symbol)}
                className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-lg font-medium transition-colors"
              >
                {sym.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Fórmulas de Exemplo
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleFormulas.map((ex) => (
              <button
                key={ex.formula}
                onClick={() => setInputFormula(ex.formula)}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm transition"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Gerar Tableau
        </button>

        {rootNode && isFormulaValid && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6 flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              Fórmula válida processada com sucesso!
            </div>
            <TreeVisualization rootNode={rootNode} />
          </div>
        )}

        {!isFormulaValid && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-center">
            <XIcon className="h-5 w-5 text-red-500 mr-2" />
            Fórmula inválida! Confira a sintaxe e tente novamente.
          </div>
        )}
      </div>
    </div>
  );
};

export default TableauAnalyzer;
