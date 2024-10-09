import XLSX from "xlsx";
import { SheetContent } from "../../types";

export function readContentFromXls(path: string): SheetContent {
  const workbook = XLSX.readFile(path, { cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  return Object.values(json).map((obj) => Object.values(obj));
}
