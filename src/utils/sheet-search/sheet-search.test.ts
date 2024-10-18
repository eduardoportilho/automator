import {
  findRowByColumnValue,
  findFirstNonEmptyRow,
  findFirstEmptyRow,
} from "./sheet-search";

describe("sheet-search", () => {
  const sheetContent = [
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
          sheetContent,
        })
      ).toEqual({
        index: 3,
        row: [],
      });
    });

    it("ignore empty cell on first column when column prop is not provided", () => {
      const content = [
        ["not", "empty"],
        ["", "not", "empty"],
        ["", ""],
        ["not", "empty"],
      ];

      expect(
        findFirstEmptyRow({
          sheetContent: content,
        })
      ).toEqual({
        index: 2,
        row: ["", ""],
      });
    });
  });

  describe("findFirstNonEmptyRow", () => {
    it("finds first non empty row", () => {
      expect(
        findFirstNonEmptyRow({
          sheetContent,
        })
      ).toEqual({
        index: 0,
        row: ["Apple", 1, "red"],
      });
    });

    it("finds first non empty row starting at index", () => {
      expect(
        findFirstNonEmptyRow({
          sheetContent,
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
          sheetContent,
          column: 2,
          startingAt: 3,
        })
      ).toEqual({
        index: 5,
        row: ["Pear", 5, "green"],
      });
    });

    it("ignore empty cell on first column when column prop is not provided", () => {
      const content = [
        ["", ""],
        ["", "not", "empty"],
        ["not", "empty"],
      ];

      expect(
        findFirstNonEmptyRow({
          sheetContent: content,
        })
      ).toEqual({
        index: 1,
        row: ["", "not", "empty"],
      });
    });
  });

  describe("findRowByColumnValue", () => {
    it("finds row by cell value", () => {
      expect(
        findRowByColumnValue({
          value: "yellow",
          column: 2,
          sheetContent,
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
          sheetContent,
        })
      ).toEqual({
        index: 2,
        row: ["Banana", 3, "yellow"],
      });
    });
  });
});
