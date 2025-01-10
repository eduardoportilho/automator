import { processHnWhoIsHiringEntry } from "./process-hn-who-is-hiring";

describe("process-hn-who-is-hiring", () => {
  describe("processHnWhoIsHiringEntry", () => {
    it.each([
      {
        testCase: "Meridian",
        row: "Meridian | Founding Engineers (Product, Infra) | NYC, New York (In-person) | https://careers.meridian.tech | Full-time",
        expected:
          "Meridian | NYC, New York (In-person) | Full-time | Founding Engineers (Product, Infra) | https://careers.meridian.tech",
      },
    ])("$testCase row", ({ row, expected }) => {
      const processed = processHnWhoIsHiringEntry(row);
      expect(processed).toBe(expected);
    });
  });
});
