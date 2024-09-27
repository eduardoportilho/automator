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
