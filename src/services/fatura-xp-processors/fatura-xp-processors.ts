import { YnabTx } from "../../types";
import { TxProcessor } from "../process-txs/process-txs";

/**
 * Rename pagamentos so they can be matched with remote
 */
const renamePagamentos: TxProcessor = (tx: YnabTx) => {
  if (tx.payee_name.trim().toLowerCase() === "pagamentos validos normais") {
    return {
      ...tx,
      payee_name: "Transfer : Itaú: C. Corrente",
    };
  }
  return tx;
};

export const FATURA_XP_PROCESSORS = [renamePagamentos];
