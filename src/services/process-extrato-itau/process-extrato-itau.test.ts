import { addDays, subDays } from "date-fns";
import { replaceFutureDateWithToday } from "./process-extrato-itau";
import { formatDate, todayString } from "../../utils/date/date";

const pastDate = formatDate(subDays(new Date(), 10));
const futureDate = formatDate(addDays(new Date(), 10));
const today = todayString();
const tx = {
  account_id: "1",
  payee_name: "",
  amount: 123,
};

describe("processEstadiaprocess-extrato-itauReport", () => {
  describe("replaceFutureDateWithToday", () => {
    it("replace future date and add memo", () => {
      const processed = replaceFutureDateWithToday({
        ...tx,
        date: futureDate,
      });

      expect(processed.date).toEqual(today);
      expect(processed.memo).toEqual(`Future dt (${futureDate})`);
    });

    it("replace future date and append memo", () => {
      const processed = replaceFutureDateWithToday({
        ...tx,
        date: futureDate,
        memo: "Existing memo",
      });

      expect(processed.date).toEqual(today);
      expect(processed.memo).toEqual(
        `Existing memo ; Future dt (${futureDate})`
      );
    });

    it("do not change tx with past date", () => {
      const processed = replaceFutureDateWithToday({
        ...tx,
        date: pastDate,
        memo: "Existing memo",
      });

      expect(processed.date).toEqual(pastDate);
      expect(processed.memo).toEqual(`Existing memo`);
    });

    it("do not change tx with present date", () => {
      const processed = replaceFutureDateWithToday({
        ...tx,
        date: today,
        memo: "Existing memo",
      });

      expect(processed.date).toEqual(today);
      expect(processed.memo).toEqual(`Existing memo`);
    });
  });
});
