export interface YnabBudgetCategory {
  name: string;
  budgeted: number;
  activity: number;
  balance: number;
}

export interface YnabBudgetCategoryGroup {
  id: string;
  name: string;
  categories: YnabBudgetCategory[];
}

export interface YnabBudget {
  month: string; // "yyyy-MM"
  categoryGroups: YnabBudgetCategoryGroup[];
  accounts?: YnabAccount[];
}

export interface YnabTx {
  account_id: string;
  date: string; // "yyyy-MM-dd"
  payee_name: string;
  amount: number; // currency * 1000
  memo?: string;
  flag_color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple";
}

export interface YnabAccount {
  id: string;
  name: string;
  balance: number;
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

interface YnabBudgetResponseCategory {
  category_group_id: string;
  name: string;
  budgeted: number;
  activity: number;
  balance: number;
  hidden: boolean;
  deleted: boolean;
}

export interface YnabBudgetResponse {
  first_month: string; //"2024-09-01",
  last_month: string; //"2024-10-01",
  category_groups: {
    id: string;
    name: string;
    hidden: boolean;
    deleted: boolean;
  }[];
  // Budget categories with amounts from last month. ex:
  // - if `last_month === "2024-10-01"`
  // - then `categories[x].budgeted === months["2024-10-01"].categories[x].budgeted`
  categories: YnabBudgetResponseCategory[];
  accounts: {
    id: string;
    name: string;
    balance: number;
    closed: boolean;
    deleted: boolean;
  }[];
  months: {
    month: string; //"2024-11-01",
    income: number;
    budgeted: number;
    activity: number;
    to_be_budgeted: number;
    age_of_money: number;
    deleted: boolean;
    categories: YnabBudgetResponseCategory[];
  }[];
}

export interface AluguelReportEntry {
  imovel: string;
  dataPagamento: string; // dd/MM/yyyy
  mesCompetencia: string; // MM/yyyy
  valorAluguel: number; // 18.299,60
  taxaAdministracao: number; // 914,98
  valorRepasse: number; // 13.403,05
  valorIr?: number; // 3.981,57
  dataEntrada?: string; // dd/MM/yyyy
  dataSaida?: string; // dd/MM/yyyy
}
