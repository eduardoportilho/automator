import { parse, format, isValid } from "date-fns";

const DMY_FORMAT = "dd/MM/yyyy";
const MDY_FORMAT = "MM/dd/yyyy";

export const convertDateDMYtoMDY = (dateDMY: string) => {
  if (!dateDMY) {
    throw new Error("Error parsing date: empty string");
  }
  const parsedDate = parse(dateDMY, DMY_FORMAT, new Date());
  return format(parsedDate, MDY_FORMAT);
};
