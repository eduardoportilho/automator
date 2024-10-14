export interface YnabBudgetCategory {
  name: string;
  budgeted: number;
  activity: number;
  available: number;
}

export interface YnabBudgetCategoryGroup {
  name: string;
  categories: YnabBudgetCategory[];
}

export interface YnabBudget {
  month: string; // "yyyy-MM"
  categoryGroups: YnabBudgetCategoryGroup[];
}

export interface YnabTx {
  account_id: string;
  date: string; // "yyyy-MM-dd"
  payee_name: string;
  amount: number; // currency * 1000
  memo?: string;
  flag_color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple";
}

export interface Carteira {
  fiis: Acao[];
  acoes: Acao[];
  rendaFixa: Fundo[];
  fundos: Fundo[];
}

export interface Acao {
  ativo: string;
  cotacao: number;
  quantidade: number;
  posicao?: number;
}

export interface Fundo {
  nome: string;
  quantidade?: number;
  precoUnitario?: number;
  posicaoMercado: number;
  valorLiquido: number;
}

export interface CellPosition {
  indexes: { row: number; col: number }; // 0-based
  rowCol: { row: number; col: number }; // 0-based
  a1: string; // e.g. A1
}

export type CellValue = string | number;

export type RowValue = CellValue[];

export type SheetContent = RowValue[];
