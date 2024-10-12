import {
  FIIS_TITLE,
  ACOES_TITLE,
  RENDA_FIXA_TITLE,
  FUNDOS_INVESTIMENTOS_TITLE,
  NEXT_DATE_ANCHOR,
} from "../../constants";
import { Acao, Carteira, Fundo, SheetContent } from "../../types";

import { findSheetSection } from "../patrimonio-sheet/patrimonio-sheet";

const ACAO_HEADER = ["Qtd", "Cotação", "Posição"];
const FUNDO_HEADER = ["Qtd", "Preço Unitário", "Posição", "Valor líquido"];
const EMPTY_ACAO_ROW = ["", "", ""];
const EMPTY_FUNDO_ROW = ["", "", ""];

const createAcaoRow = ({ ativo, acoes }: { ativo: string; acoes: Acao[] }) => {
  const acaoCarteira = acoes.find((acao) => acao.ativo === ativo);

  if (acaoCarteira) {
    const { quantidade, cotacao, posicao } = acaoCarteira;

    return [quantidade, cotacao, posicao ?? ""];
  }
  return EMPTY_ACAO_ROW;
};

const createFundoRow = ({
  ativo,
  fundos,
}: {
  ativo: string;
  fundos: Fundo[];
}) => {
  const fundoCarteira = fundos.find((fundo) => fundo.nome === ativo);

  if (fundoCarteira) {
    const { quantidade, precoUnitario, posicaoMercado, valorLiquido } =
      fundoCarteira;

    return [
      quantidade ?? "",
      precoUnitario ?? "",
      posicaoMercado,
      valorLiquido,
    ];
  }
  return EMPTY_FUNDO_ROW;
};

const getAtivosInSection = ({
  sectionTitle,
  sheetContent,
}: {
  sectionTitle: string;
  sheetContent: SheetContent;
}) => {
  const sectionData = findSheetSection({
    sectionTitle,
    sheetContent,
  });

  if (!sectionData) {
    return null;
  }
  return sectionData.map((row) => row[0].toString()); //ativos in col 0
};

export const createPatrimonioEntry = ({
  date,
  sheetContent,
  carteira,
}: {
  date: string;
  sheetContent: SheetContent;
  carteira: Carteira;
}) => {
  const ativosFiisInSheet = getAtivosInSection({
    sectionTitle: FIIS_TITLE,
    sheetContent,
  });
  const ativosAcoesInSheet = getAtivosInSection({
    sectionTitle: ACOES_TITLE,
    sheetContent,
  });
  const ativosRendaFixaInSheet = getAtivosInSection({
    sectionTitle: RENDA_FIXA_TITLE,
    sheetContent,
  });
  const ativosFundosInvestimentosInSheet = getAtivosInSection({
    sectionTitle: FUNDOS_INVESTIMENTOS_TITLE,
    sheetContent,
  });

  return [
    [date, "", "", "", NEXT_DATE_ANCHOR], // The range has 4 cols and we move NEXT_DATE_ANCHOR to the next col
    [], // Title: FIIs
    [],
    ACAO_HEADER,
    ...ativosFiisInSheet.map((ativo) =>
      createAcaoRow({ ativo, acoes: carteira.fiis })
    ),
    [],
    [], // Title: Ações
    [],
    ACAO_HEADER,
    ...ativosAcoesInSheet.map((ativo) =>
      createAcaoRow({ ativo, acoes: carteira.acoes })
    ),
    [],
    [], // Title: Renda Fixa
    [],
    FUNDO_HEADER,
    ...ativosRendaFixaInSheet.map((ativo) =>
      createFundoRow({ ativo, fundos: carteira.rendaFixa })
    ),
    [],
    [], // Title: Fundos de Investimentos
    [],
    FUNDO_HEADER,
    ...ativosFundosInvestimentosInSheet.map((ativo) =>
      createFundoRow({ ativo, fundos: carteira.fundos })
    ),
  ];
};