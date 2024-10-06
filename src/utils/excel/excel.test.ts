import {
  findRowByColumnValue,
  findFirstNonEmptyRow,
  findFirstEmptyRow,
  rowIncludes,
} from "./excel";

describe("excel", () => {
  const excelContent = [
    ["Apple", 1, "red"],
    ["Banana", 2, "yellow"],
    ["Banana", 3, "yellow"],
    [],
    ["Coconut", 4, ""],
    ["Pear", 5, "green"],
  ];

  describe("findFirstEmptyRow", () => {
    it("finds first empty row", () => {
      expect(
        findFirstEmptyRow({
          excelContent,
        })
      ).toEqual({
        index: 3,
        row: [],
      });
    });
  });

  describe("findFirstNonEmptyRow", () => {
    it("finds first non empty row", () => {
      expect(
        findFirstNonEmptyRow({
          excelContent,
        })
      ).toEqual({
        index: 0,
        row: ["Apple", 1, "red"],
      });
    });

    it("finds first non empty row starting at index", () => {
      expect(
        findFirstNonEmptyRow({
          excelContent,
          startingAt: 3,
        })
      ).toEqual({
        index: 4,
        row: ["Coconut", 4, ""],
      });
    });

    it("finds first non empty column starting at index", () => {
      expect(
        findFirstNonEmptyRow({
          excelContent,
          column: 2,
          startingAt: 3,
        })
      ).toEqual({
        index: 5,
        row: ["Pear", 5, "green"],
      });
    });
  });

  describe("findRowByColumnValue", () => {
    it("finds row by cell value", () => {
      expect(
        findRowByColumnValue({
          value: "yellow",
          column: 2,
          excelContent,
        })
      ).toEqual({
        index: 1,
        row: ["Banana", 2, "yellow"],
      });
    });

    it("finds row by cell value starting at index", () => {
      expect(
        findRowByColumnValue({
          value: "yellow",
          column: 2,
          startingAt: 2,
          excelContent,
        })
      ).toEqual({
        index: 2,
        row: ["Banana", 3, "yellow"],
      });
    });
  });

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
