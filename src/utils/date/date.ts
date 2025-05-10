import {
  parse,
  format as formatDateFn,
  differenceInCalendarDays,
  formatISO,
  startOfMonth,
  isFuture as isFutureDateFn,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";

export const DMY_FORMAT = "dd/MM/yyyy";
export const DMY_REGEX = /[0-3]\d\/[0-1]\d\/\d{4}/;
export const MMYYYY_REGEX = /[0-1]\d\/\d{4}/; // 07/2024
export const MDY_FORMAT = "MM/dd/yyyy";
export const YNAB_DATE_FORMAT = "yyyy-MM-dd";
export const YNAB_MONTH_FORMAT = "MMM yyyy"; // Sep 2024
export const ISO_MONTH_FORMAT = "yyyy-MM";

export const MONTHS_PT_BR = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
export const MONTHS_MMM_PT_BR = MONTHS_PT_BR.map((month) => month.slice(0, 3));

// Outubro/2024
export const MONTH_YEAR_PT_BR_REGEX = new RegExp(
  `(?<mes>${MONTHS_PT_BR.join("|")})` + /\/(?<ano>\d{4})/.source,
  "i"
);

export const isFuture = (date: string, dateFormat = YNAB_DATE_FORMAT) =>
  isFutureDateFn(parse(date, dateFormat, new UTCDate()));

export const formatDate = (date: Date, dateFormat = YNAB_DATE_FORMAT) =>
  formatDateFn(date, dateFormat);

export const todayString = (dateFormat = YNAB_DATE_FORMAT) =>
  formatDateFn(new UTCDate(), dateFormat);

export const nowIsoString = () => formatISO(new UTCDate());

export const firstDayOfMoth = () => startOfMonth(new UTCDate());

export const convertDateDMYtoMDY = (dateDMY: string) => {
  if (!dateDMY) {
    throw new Error("Error parsing date: empty string");
  }
  const parsedDate = parse(dateDMY, DMY_FORMAT, new UTCDate());
  return formatDateFn(parsedDate, MDY_FORMAT);
};

export const convertDateFormat = ({
  date,
  inputFormat,
  outputFormat,
}: {
  date: string;
  inputFormat: string;
  outputFormat: string;
}) => {
  if (!date) {
    throw new Error("Error parsing date: empty string");
  }
  const parsedDate = parse(date, inputFormat, new UTCDate());
  return formatDateFn(parsedDate, outputFormat);
};

export const parseDateStringIfValid = ({
  value,
  dateFormat,
}: {
  value: any;
  dateFormat: string;
}) => {
  try {
    if (typeof value !== "string") {
      return null;
    }
    const date = parse(value, dateFormat, new UTCDate());

    if (!isValidDateObject(date)) {
      return null;
    }

    return date;
  } catch (e) {
    return null;
  }
};

export const isValidDateObject = (object: any) => {
  if (Object.prototype.toString.call(object) !== "[object Date]") {
    return false;
  }

  if (isNaN(object.getTime())) {
    return false;
  }

  return true;
};

export const diffInDays = ({
  laterDate,
  earlierDate,
  dateFormat = DMY_FORMAT,
}: {
  laterDate: string;
  earlierDate: string;
  dateFormat?: string;
}) => {
  // Number of calendar days between the given dates - times are removed from the dates and then the difference in days is calculated.
  return differenceInCalendarDays(
    parse(laterDate, dateFormat, new UTCDate()),
    parse(earlierDate, dateFormat, new UTCDate())
  );
};
