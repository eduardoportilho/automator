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
}

export interface Fundo {
  nome: string;
  quantidade?: number;
  precoUnitario?: number;
  posicaoMercado: number;
  valorLiquido: number;
}
