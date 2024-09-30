import { parse, format } from "date-fns";

export const DMY_FORMAT = "dd/MM/yyyy";
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
