import { findExcelSectionByTitle } from "./find-excel-section-by-title";

describe("findExcelSectionByTitle", () => {
  it("finds section", () => {
    const excelContent = [
      [],
      ["Title of the section 1"],
      [],
      ["Apple", 1, "red"],
      ["Banana", 2, "yellow"],
      [],
      ["Title of the section 2"],
      [],
      ["Coconut", 4, ""],
      ["Pear", 5, "green"],
    ];

    const section1 = findExcelSectionByTitle({
      title: "Title of the section 1",
      excelContent,
    });

    expect(section1).toEqual(
      expect.objectContaining({
        section: [
          ["Apple", 1, "red"],
          ["Banana", 2, "yellow"],
        ],
      })
    );

    const section2 = findExcelSectionByTitle({
      title: "Title of the section 2",
      excelContent,
    });

    expect(section2).toEqual(
      expect.objectContaining({
        section: [
          ["Coconut", 4, ""],
          ["Pear", 5, "green"],
        ],
      })
    );
  });
});
