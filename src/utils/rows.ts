export const splitRows = (content: string): string[] => {
  return content.split(/\r?\n/);
};

/**
 * Split string into rows and columns
 * @param
 * - separator: cell separator, ex. ','
 * - options.removeEmptyRows: remove empty rows from result if true, retur empty array for empty rows otherwise
 * - options.removeCellQuotes: remove `"` surounding cell values if true ('"1.234,56"' → '1.234,56')
 * @returns
 */
export const splitCsv = ({
  content,
  separator,
  options = {},
}: {
  content: string;
  separator: string | RegExp;
  options?: {
    removeEmptyRows?: boolean;
    removeCellQuotes?: boolean;
  };
}): string[][] => {
  return splitRows(content)
    .map((row) => {
      if (row.trim().length === 0) {
        return options.removeEmptyRows ? null : [];
      }
      let cells = row.split(separator);

      if (options.removeCellQuotes) {
        cells = cells.map((cell) => cell.replace(/^"(.*)"$/, "$1"));
      }
      return cells;
    })
    .filter(Boolean);
};

export const joinRows = ({
  rows,
  header,
}: {
  rows: string[];
  header?: string;
}): string => {
  const content = header ? [header, ...rows] : rows;
  return content.join("\n");
};
