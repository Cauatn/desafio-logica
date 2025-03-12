import CheckIcon from "./CheckIcon";
import { XIcon } from "./XIcon";

function FormulaInput({ formula, setFormula, isValid }: any) {
  return (
    <div className="mb-6">
      <label
        htmlFor="formula-input"
        className="block text-sm font-medium mb-2 text-gray-700"
      >
        Enter Propositional Logic Formula
      </label>
      <div className="relative">
        <input
          id="formula-input"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className={`w-full p-4 pr-12 text-lg rounded-lg border-2 shadow-sm transition-all focus:ring-2 focus:ring-opacity-50 ${
            formula
              ? isValid
                ? "border-green-500 focus:ring-green-200"
                : "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
          placeholder="Exemplo: (A ∧ B) → C"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {formula &&
            (isValid ? (
              <CheckIcon className="h-6 w-6 text-green-500" />
            ) : (
              <XIcon className="h-6 w-6 text-red-500" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default FormulaInput;
