import XLSX, { Sheet2JSONOpts } from "xlsx";
import { CellValue, SheetContent } from "../../types";

export function readContentFromXls(
  path: string,
  opts?: Sheet2JSONOpts,
): SheetContent {
  const workbook = XLSX.readFile(path, { cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet, opts);
  return Object.values(json).map((obj) =>
    Object.values(obj as Record<string, CellValue>),
  );
}
