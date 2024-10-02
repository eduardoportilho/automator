import XLSX from "xlsx";

export type ExcelCellValue = string | number;

export type ExcelRowValue = ExcelCellValue[];

export type ExcelContent = ExcelRowValue[];

export function readContentFromXls(path: string): ExcelContent {
  const workbook = XLSX.readFile(path, { cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  return Object.values(json).map((obj) => Object.values(obj));
}

export const findRowByColumnValue = ({
  value,
  column,
  excelContent,
}: {
  value: any;
  column: number;
  excelContent: ExcelContent;
}) => {
  const index = excelContent.findIndex((row) => {
    if (row.length <= column) {
      return false;
    }

    return row[column] === value;
  });

  return {
    index,
    row: index >= 0 ? excelContent[index] : null,
  };
};

// [
//   "01/09/2024",
//   "Dl*google Gsuite",
//   "",
//   168,
// ]

// [
//   "lançamentos internacionais",
// ]

// [
//   "01/09/2024",
//   "dólar de conversão",
//   "",
//   5.98,
// ]

// [
//   "Payu*ar*uber         94",
//   "",
//   38.39,
// ]
