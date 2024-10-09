import { findExcelSectionByTitleAndHeader } from "./find-excel-section-by-title-header";

describe("findExcelSectionByTitleAndHeader", () => {
  it("finds section", () => {
    const excelContent = [
      [],
      ["Title of the section 1"],
      [],
      ["Fruit", "Qtd", "color"],
      ["Apple", 1, "red"],
      ["Banana", 2, "yellow"],
      [],
      ["Title of the section 2"],
      [],
      ["Fruit", "Qtd", "color"],
      ["Coconut", 4, ""],
      ["Pear", 5, "green"],
    ];

    const section1 = findExcelSectionByTitleAndHeader({
      title: "Title of the section 1",
      headerCells: ["Fruit", "Qtd", "color"],
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

    const section2 = findExcelSectionByTitleAndHeader({
      title: "Title of the section 2",
      headerCells: ["Fruit", "Qtd", "color"],
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
