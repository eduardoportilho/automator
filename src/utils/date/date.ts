import { parse, format, differenceInCalendarDays } from "date-fns";

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

// Outubro/2024
export const MONTH_YEAR_PT_BR_REGEX = new RegExp(
  `(?<mes>${MONTHS_PT_BR.join("|")})` + /\/(?<ano>\d{4})/.source,
  "i"
);

export const convertDateDMYtoMDY = (dateDMY: string) => {
  if (!dateDMY) {
    throw new Error("Error parsing date: empty string");
  }
  const parsedDate = parse(dateDMY, DMY_FORMAT, new Date());
  return format(parsedDate, MDY_FORMAT);
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
  const parsedDate = parse(date, inputFormat, new Date());
  return format(parsedDate, outputFormat);
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
    const date = parse(value, dateFormat, new Date());

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
    parse(laterDate, dateFormat, new Date()),
    parse(earlierDate, dateFormat, new Date())
  );
};
