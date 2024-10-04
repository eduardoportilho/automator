import {
  convertDateDMYtoMDY,
  parseDateStringIfValid,
  isValidDateObject,
} from "./date";

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

  describe("parseDateStringIfValid", () => {
    it("return parsed date for valid date strings", () => {
      expect(
        parseDateStringIfValid({
          value: "16/09/2024",
          dateFormat: "dd/MM/yyyy",
        }).toISOString()
      ).toMatch("2024-09-16");
      expect(
        parseDateStringIfValid({
          value: "09/16/2024",
          dateFormat: "MM/dd/yyyy",
        }).toISOString()
      ).toMatch("2024-09-16");
    });

    it("return null for date in different format", () => {
      expect(
        parseDateStringIfValid({
          value: "16/09/2024",
          dateFormat: "MM/dd/yyyy",
        })
      ).toBeNull();
    });

    it("return null for different types", () => {
      expect(
        parseDateStringIfValid({
          value: 123,
          dateFormat: "MM/dd/yyyy",
        })
      ).toBeNull();
      expect(
        parseDateStringIfValid({
          value: null,
          dateFormat: "MM/dd/yyyy",
        })
      ).toBeNull();
      expect(
        parseDateStringIfValid({
          value: undefined,
          dateFormat: "MM/dd/yyyy",
        })
      ).toBeNull();
    });
  });
  describe("isValidDateObject", () => {
    it("return true for valid Date object", () => {
      expect(isValidDateObject(new Date())).toBe(true);
      expect(isValidDateObject(new Date("2024-10-03T18:56:12.207Z"))).toBe(
        true
      );
    });

    it("return false for not valid Date objects", () => {
      expect(isValidDateObject(new Date("foo"))).toBe(false);
      expect(isValidDateObject("2024-10-03T18:56:12.207Z")).toBe(false);
      expect(isValidDateObject(null)).toBe(false);
      expect(isValidDateObject(undefined)).toBe(false);
    });
  });
});
