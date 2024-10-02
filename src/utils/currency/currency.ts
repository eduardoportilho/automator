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
 * @param amountBR ex. "1.234,56", "1.234,56"
 * @returns number ex. 1234.56
 */
export const parseAmountBR = (amountBR: string): number => {
  const amountUS = amountBR
    .replace(/[a-zA-Z\$\s]/g, "") // remove currency symbol and spacs
    .replace(/\./g, "") // remove thousand separator
    .replace(/,/g, "."); // remplace decimal separator

  const numeric = parseFloat(amountUS);
  if (isNaN(numeric)) {
    throw new Error(`Invalid BR amount: ${amountBR}`);
  }
  return numeric;
};

/**
 * Format YNAB amount in US standard
 * @param ynabAmount currency * 1000, ex. 1234560
 * @returns ex. "1234.56"
 */
export const formatYnabAmountUS = (ynabAmount: number) => {
  const amount = ynabAmount / 1000.0;
  return amount.toFixed(2);
};

/**
 * Convert a numeric amount to numeric ynab amount
 * @param amount ex. 1234.56
 * @returns ex. 1234560
 */
export const convertAmountToYnab = (amount: number): number =>
  Math.round(amount * 1000.0);
