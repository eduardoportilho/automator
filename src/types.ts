export interface YnabTx {
  account_id: string;
  date: string; // "yyyy-MM-dd"
  payee_name: string;
  amount: number; // currency * 1000
}
