import { YnabTx } from "../../types";
import { TxProcessor } from "../process-txs/process-txs";

/**
 * Rename pagamentos so they can be matched with remote
 */
const renameCommon: TxProcessor = (tx: YnabTx) => {
  if (tx.payee_name.trim().toUpperCase().startsWith("TED 102.0001.EDUARDO")) {
    return { ...tx, payee_name: "Transfer : XP: C. Corrente" };
  }
  if (tx.payee_name.trim().toUpperCase().startsWith("INT PERSON INFI")) {
    return { ...tx, payee_name: "Transfer : Itaú: V. Infinite" };
  }
  if (tx.payee_name.trim().toUpperCase().startsWith("RESGATE CDB")) {
    return { ...tx, payee_name: "Transfer : Itaú: CDB-DI" };
  }
  if (tx.payee_name.trim().toUpperCase().startsWith("PIX QRS TELEFONICA")) {
    return { ...tx, memo: "Internet GTC" };
  }
  return tx;
};

export const EXTRATO_ITAU_PROCESSORS = [renameCommon];
