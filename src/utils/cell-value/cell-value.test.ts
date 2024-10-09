import { rowIncludes } from "./cell-value";

describe("cell-value", () => {
  describe("rowIncludes", () => {
    it("returns true if row contains all values", () => {
      const row = [
        "15,5% | Pós-Fixado",
        "Posição",
        "% Alocação",
        "Rentabilidade Líquida",
        "Rentabilidade Bruta",
        "Valor aplicado",
        "Valor líquido",
      ];

      const headerCells = ["Posição", "Valor Líquido"];

      expect(rowIncludes(row, headerCells)).toBe(true);
    });

    it("returns false if row does not contains all values", () => {
      const row = [
        "15,5% | Pós-Fixado",
        "% Alocação",
        "Rentabilidade Líquida",
        "Rentabilidade Bruta",
        "Valor aplicado",
        "Valor líquido",
      ];

      const headerCells = ["Posição", "Valor Líquido"];

      expect(rowIncludes(row, headerCells)).toBe(false);
    });
  });
});
