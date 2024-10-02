import {
  convertAmountBRtoUS,
  parseAmountBR,
  formatYnabAmountUS,
  convertAmountToYnab,
} from "./currency";

describe("currency", () => {
  describe("convertAmountBRtoUS", () => {
    it("converts amount from BR to US format", () => {
      expect(convertAmountBRtoUS("1.234,567")).toBe("1234.567");
      expect(convertAmountBRtoUS("-1234,567")).toBe("-1234.567");
      expect(convertAmountBRtoUS("0")).toBe("0");
    });

    it("throws if number is invalid", () => {
      expect(() => convertAmountBRtoUS("")).toThrow();
      expect(() => convertAmountBRtoUS("abc")).toThrow();
    });
  });

  describe("parseAmountBR", () => {
    it("parses number from BR formatted amount", () => {
      expect(parseAmountBR("R$ 1.234,567")).toBe(1234.567);
      expect(parseAmountBR("R$ -1.234,567")).toBe(-1234.567);
      expect(parseAmountBR("1.234,567")).toBe(1234.567);
      expect(parseAmountBR("-1234,567")).toBe(-1234.567);
      expect(parseAmountBR("0")).toBe(0);
    });

    it("throws if number is invalid", () => {
      expect(() => parseAmountBR("")).toThrow();
      expect(() => parseAmountBR("abc")).toThrow();
    });
  });

  describe("formatYnabAmountUS", () => {
    it("formats YNAB amount in US standard", () => {
      expect(formatYnabAmountUS(1234560)).toBe("1234.56");
      expect(formatYnabAmountUS(1234569)).toBe("1234.57");
      expect(formatYnabAmountUS(-1234569)).toBe("-1234.57");
      expect(formatYnabAmountUS(0)).toBe("0.00");
    });
  });

  describe("convertAmountToYnab", () => {
    it("converts numeric amount to numeric ynab amount", () => {
      expect(convertAmountToYnab(1234.56)).toBe(1234560);
      expect(convertAmountToYnab(-1234.56)).toBe(-1234560);
      expect(convertAmountToYnab(1234)).toBe(1234000);
      expect(convertAmountToYnab(1)).toBe(1000);
      expect(convertAmountToYnab(0)).toBe(0);
    });
  });
});
