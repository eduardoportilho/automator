import {
  findRowContainingValue,
  findFirstEmptyRow,
} from "../../utils/sheet-search/sheet-search";
import { Acao, Carteira, Fundo } from "../../types";
import { splitCsv } from "../../utils/rows";
import { cleanAndParseAmountBR } from "../../utils/currency/currency";

const rowToAcao = (row: string[]): Acao => {
  if (row.length < 5) {
    return null;
  }

  const [ativo, quantidade, cotacao, posicao] = row;

  return {
    ativo,
    quantidade: cleanAndParseAmountBR(quantidade),
    cotacao: cleanAndParseAmountBR(cotacao),
    posicao: cleanAndParseAmountBR(posicao),
  };
};

const rowToFundo = (row: string[]): Fundo => {
  if (row.length < 5) {
    return null;
  }

  const [
    ativo,
    emissor,
    indexador,
    taxa,
    pctIndexador,
    dataAplicacao,
    vencimento,
    quantidade,
    valorAplicado,
    saldoBruto,
    irPrevisto,
    iofPrevisto,
    saldoLiquido,
    status,
    localNegociacao,
  ] = row;

  const quantidadeNumber = cleanAndParseAmountBR(quantidade);
  const saldoLiquidoNumber = cleanAndParseAmountBR(saldoLiquido);
  const precoUnitario = saldoLiquidoNumber / quantidadeNumber;

  return {
    nome: `${ativo} - ${emissor}`,
    quantidade: quantidadeNumber,
    precoUnitario: precoUnitario,
    posicaoMercado: saldoLiquidoNumber,
    valorLiquido: saldoLiquidoNumber,
  };
};

const findSectionByHeader = ({
  rows,
  headerValue,
}: {
  rows: string[][];
  headerValue: string;
}) => {
  const { index: headerIndex } = findRowContainingValue({
    value: headerValue,
    sheetContent: rows,
  });
  const { index: nextEmptyRowIndex } = findFirstEmptyRow({
    startingAt: headerIndex,
    sheetContent: rows,
  });
  const endIndex = nextEmptyRowIndex >= 0 ? nextEmptyRowIndex : undefined;

  return rows.slice(headerIndex + 1, endIndex);
};

/**
 * Convert safra carteira CSV content into carteira object
 * @param csvContent
 */
export const convertCarteiraSafraCsvTo = (csvContent: string): Carteira => {
  const rows = splitCsv({ content: csvContent, separator: "," });

  const rendaFixaData = findSectionByHeader({
    headerValue: "Indexador",
    rows,
  });
  const fiiData = findSectionByHeader({
    headerValue: "Cotação",
    rows,
  });

  return {
    fiis: fiiData.map(rowToAcao).filter(Boolean),
    acoes: [],
    rendaFixa: rendaFixaData.map(rowToFundo).filter(Boolean),
    fundos: [],
  };
};
