import { convertAmountBRtoUS } from "./currency";

describe("currency", () => {
  describe("convertAmountBRtoUS", () => {
    it("convert amount from BR to US format", () => {
      expect(convertAmountBRtoUS("1.234,567")).toBe("1234.567");
      expect(convertAmountBRtoUS("-1234,567")).toBe("-1234.567");
      expect(convertAmountBRtoUS("0")).toBe("0");
    });

    it("throws if number is invalid", () => {
      expect(() => convertAmountBRtoUS("")).toThrow();
      expect(() => convertAmountBRtoUS("abc")).toThrow();
    });
  });
});
