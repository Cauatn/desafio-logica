import { useState, useEffect } from "react";
import FormulaVisualizer from "../../components/FormulaVisualizer";
import parseFormula from "../../hooks/parseFormula";
import TruthTable from "../../components/TruthTable";
import FormulaDisplay from "../../components/FormulaJSONDisplay";
import CheckIcon from "../../components/CheckIcon";
import generateTruthTableWithSubExpressions from "../../hooks/generateExpression";
import FormulaInput from "../../components/FormulaInput";
import { XIcon } from "../../components/XIcon";
import { Link } from "react-router";

const SymbolPalette = ({ insertSymbol }: any) => {
  const symbols = [
    { symbol: "∧", name: "E", desc: "Conjução" },
    { symbol: "∨", name: "OU", desc: "Disjunção" },
    { symbol: "¬", name: "NÃO", desc: "Negação" },
    { symbol: "→", name: "IMPLICA", desc: "Implicação" },
    { symbol: "↔", name: "BICOND", desc: "Bi-Condicional" },
    { symbol: "(", name: "ABERTO", desc: "Parenteses aberto" },
    { symbol: ")", name: "FECHADO", desc: "Parenteses fechado" },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-gray-700">Logic Symbols</h3>
      <div className="flex flex-wrap gap-2">
        {symbols.map((sym) => (
          <button
            key={sym.symbol}
            onClick={() => insertSymbol(sym.symbol)}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg font-medium flex flex-col items-center transition-colors"
            title={`${sym.name}: ${sym.desc}`}
          >
            <span>{sym.symbol}</span>
            <span className="text-xs text-gray-600">{sym.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function PropositionalLogicAnalyzer() {
  const [formula, setFormula] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [variables, setVariables] = useState([]);
  const [ast, setAst] = useState(null);

  // Guardamos as subexpressões e a tabela "completa"
  const [subExpressions, setSubExpressions] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [showVisualization, setShowVisualization] = useState(false);
  const [showAst, setShowAst] = useState(false);

  useEffect(() => {
    const cleanFormula = formula.replace(/\s+/g, "");
    const result = parseFormula(cleanFormula);
    setIsValid(result.isValid);
    setAst(result.ast);

    if (result.isValid && result.ast) {
      // Ordenamos as variáveis em ordem alfabética
      const sortedVars = [...new Set(result.variables)].sort();
      setVariables(sortedVars as any);

      // Geramos a tabela verdade com todas as subexpressões
      const { subExpressions, table } = generateTruthTableWithSubExpressions(
        sortedVars,
        result.ast
      );

      setSubExpressions(subExpressions as any);
      setTableData(table as any);
    } else {
      setVariables([]);
      setSubExpressions([]);
      setTableData([]);
    }
  }, [formula]);

  const insertSymbol = (symbol: string) => {
    setFormula((prev) => prev + symbol);
  };

  // Exemplos prontos
  const exampleFormulas = [
    { name: "Conjunção simples", formula: "A ∧ B" },
    { name: "Implicação", formula: "(A ∧ B) → C" },
    { name: "Bi-Condicional", formula: "A ↔ (B ∨ C)" },
    { name: "Contradição", formula: "A ∧ ¬A" },
    { name: "Tautologia", formula: "A ∨ ¬A" },
    { name: "Complexa", formula: "((P → Q) ∧ (Q → R)) → (P → R)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Analisador de lógica proposicional
            </h1>
            <p className="text-gray-600 mb-6">
              Analise proposições formulas lógicas e gere sua tabela verdade
            </p>
          </div>
          <Link className="p-4 bg-emerald-400 rounded-sm" to={"/tableau"}>
            TABLEUX SOLVER
          </Link>
        </div>

        {/* Campo para inserir fórmula */}
        <FormulaInput
          formula={formula}
          setFormula={setFormula}
          isValid={isValid}
        />

        {/* Botões de símbolos lógicos */}
        <SymbolPalette insertSymbol={insertSymbol} />

        {/* Botões de exemplo */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Formulas de Exemplo
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleFormulas.map((ex) => (
              <button
                key={ex.formula}
                onClick={() => setFormula(ex.formula)}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Se a fórmula for válida, exibe um alerta de sucesso */}
        {isValid && ast && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium text-green-800">
                Formula valida!{" "}
              </span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Sua formula usa {variables.length} variaveis
              {variables.length !== 1 ? "s" : ""}: {variables.join(", ")}
            </p>
          </div>
        )}

        {/* Se a fórmula for inválida, exibe um alerta de erro */}
        {formula && !isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium text-red-800">Invalid formula</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Cheque por uma sintaxe valida incluindo parenteses balanceados e
              operadores validos.
            </p>
          </div>
        )}

        {/* Se for válida, renderiza a visualização e a tabela */}
        {isValid && ast && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showVisualization
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setShowVisualization(!showVisualization)}
              >
                {showVisualization ? "Esconder" : "Mostrar"} Visualização de
                fórmula
              </button>

              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAst
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setShowAst(!showAst)}
              >
                {showAst ? "Esconder" : "Mostrar"} Estrutura AST
              </button>
            </div>

            {/* Visualização em forma de árvore */}
            {showVisualization && <FormulaVisualizer ast={ast} />}

            {/* Exibir AST em JSON */}
            {showAst && <FormulaDisplay formula={formula} ast={ast} />}

            {/* Tabela verdade que mostra cada subexpressão */}
            <TruthTable
              variables={variables}
              ast={ast}
              subExpressions={subExpressions}
              tableData={tableData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
