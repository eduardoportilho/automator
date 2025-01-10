import { sortByFieldIndex } from "./array";

describe("array", () => {
  describe("sortByFieldIndex", () => {
    it("does something", () => {
      const array = [
        { name: "foo", id: 1 },
        { name: "bar", id: 2 },
        { name: "doe", id: 3 },
      ];

      const output = sortByFieldIndex({
        array,
        key: "name",
        sortedFieldValues: ["doe", "foo"],
      });

      expect(output).toEqual([
        { name: "doe", id: 3 },
        { name: "foo", id: 1 },
        { name: "bar", id: 2 },
      ]);
    });
  });
});
