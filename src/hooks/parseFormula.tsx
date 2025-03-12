// Definindo precedência dos operadores para o parser
const OPERATORPRECEDENCE = ["¬", "∧", "∨", "→", "↔"];

// Parser da fórmula
export default function parseFormula(input: any) {
  try {
    let pos = 0;
    let variables = new Set();

    if (!input) return { isValid: false, variables: [], ast: null };

    function peek() {
      return input[pos] || null;
    }

    function consume() {
      return input[pos++] || null;
    }

    function parsePrimary() {
      const char = peek();
      if (!char) return null;

      if (char === "(") {
        consume();
        const expr = parseExpression();
        if (consume() !== ")") return null;
        return expr;
      }

      if (char && /[A-Z]/.test(char.toUpperCase())) {
        variables.add(char.toUpperCase());
        consume();
        return { type: "variable", name: char.toUpperCase() };
      }

      if (char === "¬") {
        consume();
        const operand = parsePrimary();
        return operand
          ? { type: "operation", operator: "¬", right: operand }
          : null;
      }

      return null;
    }

    function parseExpression(precedenceIndex = 0) {
      if (precedenceIndex >= OPERATORPRECEDENCE.length) {
        return parsePrimary();
      }

      let left = parseExpression(precedenceIndex + 1);
      const currentOperator = OPERATORPRECEDENCE[precedenceIndex];

      while (peek() === currentOperator) {
        consume();
        const right = parseExpression(precedenceIndex + 1);
        if (!right) return null;
        left = { type: "operation", operator: currentOperator, left, right };
      }

      return left;
    }

    const ast = parseExpression();
    if (!ast || pos < input.length) {
      return { isValid: false, variables: [], ast: null };
    }

    return { isValid: true, variables: Array.from(variables), ast };
  } catch (e) {
    return { isValid: false, variables: [], ast: null };
  }
}
