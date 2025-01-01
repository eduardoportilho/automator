const regex =
  /^(?<day>[0123]\d)\/(?<month>[01]\d)\/(?<year>20\d{2})\s*(?<desc>.+?)\s*(R\$\s)?(?<amount>[-\d\.\,]+)$/;

interface Entry {
  date: string;
  desc: string;
  amount: string;
}

const parseAmountBR = (amountBR: string): number => {
  const amountUS = amountBR
    .replace(/[a-zA-Z\$\s]/g, "") // remove currency symbol and spaces
    .replace(/\./g, "") // remove thousand separator
    .replace(/,/g, "."); // remplace decimal separator

  const numeric = parseFloat(amountUS);
  if (isNaN(numeric)) {
    throw new Error(`Invalid BR amount: ${amountBR}`);
  }
  return numeric;
};

export const parseDtDescValTsvRow = (row: string): Entry | null => {
  const match = row.match(regex);

  if (
    !match?.groups.day ||
    !match?.groups.month ||
    !match?.groups.year ||
    !match?.groups.desc ||
    !match?.groups.amount
  ) {
    return null;
  }

  const { day, month, year, desc, amount } = match.groups;

  return {
    date: `${month}/${day}/${year}`,
    desc,
    amount: parseAmountBR(amount).toFixed(2),
  };
};

export const parseDtDescValTsv = (content: string) => {
  return content.split("\n").map(parseDtDescValTsvRow).filter(Boolean);
};
