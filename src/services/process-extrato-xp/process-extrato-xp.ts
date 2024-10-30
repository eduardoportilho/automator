import { YnabTx } from "../../types";
import { TxProcessor } from "../process-txs/process-txs";

const removeRepeatedSpaces: TxProcessor = (tx: YnabTx) => ({
  ...tx,
  payee_name: tx.payee_name.replace(/\s+/g, " "),
});

/**
 * Rename pagamentos so they can be matched with remote
 */
const renamePagamentos: TxProcessor = (tx: YnabTx) => {
  if (
    tx.payee_name
      .trim()
      .toUpperCase()
      .startsWith("TED BCO 341 AGE 6220 CTA 90101")
  ) {
    return { ...tx, payee_name: "Transfer - Itaú: C. Corrente" };
  }
  return tx;
};

export const EXTRATO_XP_PROCESSORS = [removeRepeatedSpaces, renamePagamentos];
