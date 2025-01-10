/**
 * Remove thousand separators and use '.' as decimal separator
 * @param amountBR ex. "1.234,56"
 * @returns ex. "1234.56"
 */
export const convertAmountBRtoUS = (amountBR: string): string => {
  const amountUS = amountBR
    .replace(/\./g, "") // remove thousand separator
    .replace(/,/g, "."); // remplace decimal separator

  const numeric = parseFloat(amountUS);
  if (isNaN(numeric)) {
    throw new Error(`Invalid BR amount: ${amountBR}`);
  }
  return amountUS;
};

/**
 * Parse number from BR formatted amount
 * @param amountBR ex. "1.234,56", "R$ 1.234,56"
 * @returns number ex. 1234.56
 */
export const parseAmountBR = (amountBR: string): number => {
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

export const cleanAndParseAmountBR = (amountBR: string): number => {
  const clean = amountBR.replace(/[^\d.,-]/g, "");
  return parseAmountBR(clean);
};

/**
 * Format YNAB amount in BR standard
 * @param ynabAmount ex. 1234.60
 * @returns ex. "1234,56"
 */
export const formatAmountBR = (amount: number) =>
  amount.toFixed(2).replace(".", ",");

/**
 * Format YNAB amount in US standard
 * @param ynabAmount currency * 1000, ex. 1234560
 * @returns ex. "1234.56"
 */
export const formatYnabAmountUS = (ynabAmount: number) => {
  const amount = convertYnabToAmount(ynabAmount);
  return amount.toFixed(2);
};

/**
 * Format YNAB amount in BR standard
 * @param ynabAmount currency * 1000, ex. 1234560
 * @returns ex. "1234,56"
 */
export const formatYnabAmountBR = (ynabAmount: number) => {
  const amount = convertYnabToAmount(ynabAmount);
  return formatAmountBR(amount);
};

export const convertYnabToAmount = (ynabAmount: number) => {
  return ynabAmount / 1000.0;
};

/**
 * Convert a numeric amount to numeric ynab amount
 * @param amount ex. 1234.56
 * @returns ex. 1234560
 */
export const convertAmountToYnab = ({
  amount,
  invert = false,
}: {
  amount: number;
  invert?: boolean;
}): number => Math.round(amount * 1000.0) * (invert ? -1 : 1);

export const roundCurrency = (amount: number) => Math.round(amount * 100) / 100;
