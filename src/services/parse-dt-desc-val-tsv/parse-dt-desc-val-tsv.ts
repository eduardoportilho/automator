const regex =
  /^(?<date>[0123]\d\/[01]\d\/20\d{2})\s*(?<desc>.+?)\s*(R\$\s)?(?<amount>[-\d\.\,]+)$/;

interface Entry {
  date: string;
  desc: string;
  amount: string;
}

export const parseDtDescValTsvRow = (row: string): Entry | null => {
  const match = row.match(regex);

  if (!match?.groups.date || !match?.groups.desc || !match?.groups.amount) {
    return null;
  }
  return {
    date: match.groups.date,
    desc: match.groups.desc,
    amount: match.groups.amount,
  };
};

export const parseDtDescValTsv = (content: string) => {
  return content.split("\n").map(parseDtDescValTsvRow).filter(Boolean);
};
