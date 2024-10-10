export const splitRows = (content: string): string[] => {
  return content.split(/\r?\n/);
};

export const splitCsv = ({
  content,
  separator,
  removeEmptyRows = false,
}: {
  content: string;
  separator: string | RegExp;
  removeEmptyRows?: boolean;
}): string[][] => {
  return splitRows(content)
    .map((row) => {
      if (row.trim().length === 0) {
        return removeEmptyRows ? null : [];
      }
      return row.split(separator);
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
