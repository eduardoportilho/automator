import { parse, format } from "date-fns";

export const DMY_FORMAT = "dd/MM/yyyy";
export const DMY_REGEX = /[0-3]\d\/[0-1]\d\/\d{4}/;
export const MDY_FORMAT = "MM/dd/yyyy";
export const YNAB_DATE_FORMAT = "yyyy-MM-dd";

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
