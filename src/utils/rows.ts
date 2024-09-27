export const splitRows = (content: string): string[] => {
  return content.split(/\r?\n/);
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
