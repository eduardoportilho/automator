import { convertDateDMYtoMDY } from "./date";

describe("date", () => {
  describe("convertDateDMYtoMDY", () => {
    it("convert date from DMY to MDY format", () => {
      expect(convertDateDMYtoMDY("06/09/2024")).toBe("09/06/2024");
      expect(convertDateDMYtoMDY("01/01/2024")).toBe("01/01/2024");
    });

    it("throws if date is invalid", () => {
      expect(() => convertDateDMYtoMDY("01/15/2024")).toThrow();
      expect(() => convertDateDMYtoMDY("abc")).toThrow();
      expect(() => convertDateDMYtoMDY("")).toThrow();
    });
  });
});
