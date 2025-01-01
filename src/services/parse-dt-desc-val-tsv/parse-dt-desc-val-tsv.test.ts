import { parseDtDescValTsvRow } from "./parse-dt-desc-val-tsv";

describe("parseDtDescValTsvRow", () => {
  it("parses row", () => {
    const { date, desc, amount } = parseDtDescValTsvRow(
      "28/12/2024  IFD*MI EMPREENDIMEN  R$ 20.201,70"
    );

    expect(date).toEqual("12/28/2024");
    expect(desc).toEqual("IFD*MI EMPREENDIMEN");
    expect(amount).toEqual("20201.70");
  });

  it("parses row with negative value", () => {
    const { date, desc, amount } = parseDtDescValTsvRow(
      "28/12/2024  IFD*MI EMPREENDIMEN  R$ -20.201,70"
    );

    expect(date).toEqual("12/28/2024");
    expect(desc).toEqual("IFD*MI EMPREENDIMEN");
    expect(amount).toEqual("-20201.70");
  });

  it("parses row with no currency", () => {
    const { date, desc, amount } = parseDtDescValTsvRow(
      "28/12/2024 IFD*MI EMPREENDIMEN 20.201,70"
    );

    expect(date).toEqual("12/28/2024");
    expect(desc).toEqual("IFD*MI EMPREENDIMEN");
    expect(amount).toEqual("20201.70");
  });

  it("ignores row with no date", () => {
    const result = parseDtDescValTsvRow("IFD*MI EMPREENDIMEN  R$ -20.201,70");

    expect(result).toBeNull();
  });

  it("ignores row with no amount", () => {
    const result = parseDtDescValTsvRow("28/12/2024  IFD*MI EMPREENDIMEN");

    expect(result).toBeNull();
  });
});
