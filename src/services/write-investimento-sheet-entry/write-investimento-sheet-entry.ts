import { format } from "date-fns";
import {
  INVESTIMENTOS_SPREADSHEET_ID,
  INVESTIMENTOS_SHEET_TITLE,
  NEXT_DATE_ANCHOR,
} from "../../constants";
import { writeRange } from "../../utils/sheets/sheets";
import { Acao, Carteira, Fundo, SheetContent } from "../../types";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";
import { cellValueEqualsTo } from "../../utils/cell-value/cell-value";
import { findFirstEmptyRow } from "../../utils/sheet-search/sheet-search";

const ACAO_HEADER = ["Qtd", "Cotação", "Posição"];
const FUNDO_HEADER = ["Qtd", "Preço Unitário", "Posição", "Valor líquido"];
const EMPTY_ACAO_ROW = ["", "", ""];
const EMPTY_FUNDO_ROW = ["", "", ""];

const buildAcaoRow = ({ ativo, acoes }: { ativo: string; acoes: Acao[] }) => {
  const acaoCarteira = acoes.find((acao) => acao.ativo === ativo);

  if (acaoCarteira) {
    const { quantidade, cotacao, posicao } = acaoCarteira;

    return [quantidade, cotacao, posicao ?? ""];
  }
  return EMPTY_ACAO_ROW;
};

const buildFundoRow = ({
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
  const titleIndex = sheetContent.findIndex(
    (row) => row.length > 0 && cellValueEqualsTo(row[0], sectionTitle)
  );
  const startIndex = titleIndex + 3; // 1: empty row, 2: header, 3: data
  const { index: nextEmptyRowIndex } = findFirstEmptyRow({
    startingAt: startIndex,
    column: 0,
    sheetContent,
  });

  // endIndex is exclusive ; undefined means end of array
  const endOfSectionIndex =
    nextEmptyRowIndex >= 0 ? nextEmptyRowIndex : undefined;

  return sheetContent
    .slice(startIndex, endOfSectionIndex) // endIndex is exclusive
    .map((row) => row[0].toString());
};

const buildRange = ({
  date,
  sheetContent,
  carteira,
}: {
  date: string;
  sheetContent: SheetContent;
  carteira: Carteira;
}) => {
  const ativosFiisInSheet = getAtivosInSection({
    sectionTitle: "FIIs",
    sheetContent,
  });
  const ativosAcoesInSheet = getAtivosInSection({
    sectionTitle: "Ações",
    sheetContent,
  });
  const ativosRendaFixaInSheet = getAtivosInSection({
    sectionTitle: "Renda Fixa",
    sheetContent,
  });
  const ativosFundosInvestimentosInSheet = getAtivosInSection({
    sectionTitle: "Fundos de Investimentos",
    sheetContent,
  });

  return [
    [date, "", "", "", NEXT_DATE_ANCHOR], // The range has 4 cols and we move NEXT_DATE_ANCHOR to the next col
    [], // Title: FIIs
    [],
    ACAO_HEADER,
    ...ativosFiisInSheet.map((ativo) =>
      buildAcaoRow({ ativo, acoes: carteira.fiis })
    ),
    [],
    [], // Title: Ações
    [],
    ACAO_HEADER,
    ...ativosAcoesInSheet.map((ativo) =>
      buildAcaoRow({ ativo, acoes: carteira.acoes })
    ),
    [],
    [], // Title: Renda Fixa
    [],
    FUNDO_HEADER,
    ...ativosRendaFixaInSheet.map((ativo) =>
      buildFundoRow({ ativo, fundos: carteira.rendaFixa })
    ),
    [],
    [], // Title: Fundos de Investimentos
    [],
    FUNDO_HEADER,
    ...ativosFundosInvestimentosInSheet.map((ativo) =>
      buildFundoRow({ ativo, fundos: carteira.fundos })
    ),
  ];
};

export const writeInvestimentoSheetEntry = ({
  startCellA1,
  carteira,
  sheetContent,
}: {
  sheetContent: SheetContent;
  carteira: Carteira;
  startCellA1: string;
}) => {
  const date = format(new Date(), YNAB_DATE_FORMAT);

  const newEntryRange = buildRange({
    date,
    sheetContent,
    carteira,
  });

  writeRange({
    spreadsheetId: INVESTIMENTOS_SPREADSHEET_ID,
    sheetTitle: INVESTIMENTOS_SHEET_TITLE,
    startCellA1: startCellA1,
    data: newEntryRange,
  });
};
