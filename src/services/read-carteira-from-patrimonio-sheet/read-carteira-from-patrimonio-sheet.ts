import {
  FIIS_TITLE,
  ACOES_TITLE,
  RENDA_FIXA_TITLE,
  FUNDOS_INVESTIMENTOS_TITLE,
} from "../../constants";
import { SheetContent, Carteira, RowValue, Acao, Fundo } from "../../types";
import { findSheetSection } from "../patrimonio-sheet/patrimonio-sheet";
import { findCellPosition } from "../../utils/sheet-search/sheet-search";
import {
  parseCellNumber,
  isEmptyCellValue,
  isEmptyRow,
} from "../../utils/cell-value/cell-value";

const getRowEntry = ({
  row,
  startCol,
  size,
}: {
  row: RowValue;
  startCol: number;
  size: number;
}) => {
  if (row.length <= startCol) {
    return null;
  }

  const ativo = row[0].toString();
  const values = row.slice(startCol, startCol + size);

  if (isEmptyRow(values)) {
    return null;
  }

  return { ativo, values };
};

const rowToAcao = ({
  row,
  startCol,
}: {
  row: RowValue;
  startCol: number;
}): Acao => {
  const rowEntry = getRowEntry({ row, startCol, size: 3 });

  if (!rowEntry) {
    return null;
  }
  const [quantidade, cotacao, posicao] = rowEntry.values;

  return {
    ativo: rowEntry.ativo,
    cotacao: isEmptyCellValue(cotacao) ? 0 : parseCellNumber(cotacao),
    quantidade: isEmptyCellValue(quantidade) ? 0 : parseCellNumber(quantidade),
    posicao: isEmptyCellValue(posicao) ? 0 : parseCellNumber(posicao),
  };
};

const rowToFundo = ({
  row,
  startCol,
}: {
  row: RowValue;
  startCol: number;
}): Fundo => {
  const rowEntry = getRowEntry({ row, startCol, size: 4 });

  if (!rowEntry) {
    return null;
  }
  const [quantidade, precoUnitario, posicaoMercado, valorLiquido] =
    rowEntry.values;

  return {
    nome: rowEntry.ativo,
    quantidade: isEmptyCellValue(quantidade) ? 0 : parseCellNumber(quantidade),
    precoUnitario: isEmptyCellValue(precoUnitario)
      ? 0
      : parseCellNumber(precoUnitario),
    posicaoMercado: isEmptyCellValue(posicaoMercado)
      ? 0
      : parseCellNumber(posicaoMercado),
    valorLiquido: isEmptyCellValue(valorLiquido)
      ? 0
      : parseCellNumber(valorLiquido),
  };
};

// read-carteira-from-patrimonio-sheet
export const readCarteiraFromPatrimonioSheet = ({
  date,
  sheetContent,
}: {
  date: string;
  sheetContent: SheetContent;
}): Carteira | null => {
  const datePosition = findCellPosition({
    value: date,
    sheetContent,
  });

  if (!datePosition) {
    return null;
  }

  const startCol = datePosition.indexes.col;
  const fiiData = findSheetSection({
    sectionTitle: FIIS_TITLE,
    sheetContent,
  });
  const acoesData = findSheetSection({
    sectionTitle: ACOES_TITLE,
    sheetContent,
  });
  const rendaFixaData = findSheetSection({
    sectionTitle: RENDA_FIXA_TITLE,
    sheetContent,
  });
  const fundosInvestimentoData = findSheetSection({
    sectionTitle: FUNDOS_INVESTIMENTOS_TITLE,
    sheetContent,
  });

  return {
    fiis: fiiData.map((row) => rowToAcao({ row, startCol })).filter(Boolean),
    acoes: acoesData.map((row) => rowToAcao({ row, startCol })).filter(Boolean),
    rendaFixa: rendaFixaData
      .map((row) => rowToFundo({ row, startCol }))
      .filter(Boolean),
    fundos: fundosInvestimentoData
      .map((row) => rowToFundo({ row, startCol }))
      .filter(Boolean),
  };
};
