import {
  ExcelContent,
  ExcelRowValue,
  rowIncludes,
  parseExcelNumber,
} from "../../utils/excel/excel";
import { Acao, Carteira, Fundo } from "../../types";
import { findExcelSectionByTitle } from "../../utils/find-excel-section-by-title/find-excel-section-by-title";
import { findExcelSectionByTitleAndHeader } from "../../utils/find-excel-section-by-title-header/find-excel-section-by-title-header";

/**
 * Look for the section with:
 * - Title: "Fundos Imobiliários"
 * - Headers: "?", ..., "Última cotação", "Quantidade de Cotas"
 * - Values: ativo, ..., cotacao, quantidade
 * @param excelContent
 * @returns
 */
const convertFundosImobiliarios = (excelContent: ExcelContent): Acao[] => {
  const columns = {
    cotacao: { header: "Última cotação", index: 6 },
    quantidade: { header: "Quantidade de Cotas", index: 7 },
  };

  return convertSectionIntoAcao({
    excelContent,
    title: "Fundos Imobiliários",
    requiredHeaders: Object.values(columns).map((col) => col.header),
    buildAcao: (row: ExcelRowValue): Acao => {
      if (row.length <= 7) {
        return null;
      }
      return {
        ativo: row[0].toString(),
        cotacao: parseExcelNumber(row[columns.cotacao.index]),
        quantidade: parseExcelNumber(row[columns.quantidade.index]),
      };
    },
  });
};

/**
 * Look for the section with:
 * - Title: "Ações"
 * - Headers: "?", ..., "Último preço (R$)", "Qtd. total"
 * - Values: ativo, ..., cotacao, quantidade
 * @param excelContent
 * @returns
 */
const convertAcoes = (excelContent: ExcelContent): Acao[] => {
  const columns = {
    cotacao: { header: "Último preço (R$)", index: 5 },
    quantidade: { header: "Qtd. total", index: 6 },
  };

  return convertSectionIntoAcao({
    excelContent,
    title: "Ações",
    requiredHeaders: Object.values(columns).map((col) => col.header),
    buildAcao: (row: ExcelRowValue): Acao => {
      if (row.length <= 6) {
        return null;
      }
      return {
        ativo: row[0].toString(),
        cotacao: parseExcelNumber(row[columns.cotacao.index]),
        quantidade: parseExcelNumber(row[columns.quantidade.index]),
      };
    },
  });
};

/**
 * - Find the section title row
 * - Check if the header row matches with requiredHeaders
 * - Map section rows to Acao[] and return
 * @param
 * - title: Section title
 * - requiredHeaders: Values that shoulb be present in the header row
 * - buildAcao: Build Acao object from row
 * @returns Acao[]
 */
const convertSectionIntoAcao = ({
  excelContent,
  title,
  requiredHeaders,
  buildAcao,
}: {
  excelContent: ExcelContent;
  title: string;
  requiredHeaders: string[];
  buildAcao: (row: ExcelRowValue) => Acao | null;
}): Acao[] => {
  let sectionBody: ExcelContent;
  let lastSectionEndIndex: number;

  while (!sectionBody) {
    const { endIndex, section } = findExcelSectionByTitle({
      title,
      excelContent,
      startingAt: lastSectionEndIndex ?? 0,
    });
    const [sectionHeaderRow, ...body] = section;
    lastSectionEndIndex = endIndex;

    if (endIndex < 0) {
      return [];
    }

    if (rowIncludes(sectionHeaderRow, requiredHeaders)) {
      sectionBody = body;
    }
  }

  return sectionBody.map((row) => buildAcao(row)).filter(Boolean);
};

/**
 * Look for the section with:
 * - Title: "Renda Fixa"
 * - Headers: "?", "Posição a mercado", ..., "Quantidade", "Preço Unitário", ..., "Valor Líquido"
 * - Values: ativo, posicaoMercado, ..., quantidade, precoUnitario, ..., valorLiquido
 * @param excelContent
 * @returns
 */
const convertRendaFixa = (excelContent: ExcelContent): Fundo[] => {
  const columns = {
    posicaoMercado: { header: "Posição a mercado", index: 1 },
    quantidade: { header: "Quantidade", index: 7 },
    precoUnitario: { header: "Preço Unitário", index: 8 },
    valorLiquido: { header: "Valor Líquido", index: 11 },
  };

  const { section } = findExcelSectionByTitleAndHeader({
    excelContent,
    title: "Renda Fixa",
    headerCells: Object.values(columns).map((col) => col.header),
  });

  return section.map((row) => ({
    nome: row[0].toString(),
    quantidade: parseExcelNumber(row[columns.quantidade.index]),
    precoUnitario: parseExcelNumber(row[columns.precoUnitario.index]),
    posicaoMercado: parseExcelNumber(row[columns.posicaoMercado.index]),
    valorLiquido: parseExcelNumber(row[columns.valorLiquido.index]),
  }));
};

/**
 * Look for the section with:
 * - Title: "Fundos de Investimentos"
 * - Headers: "?", "Posição", ..., "Valor Líquido"
 * - Values: ativo, posicaoMercado, ..., valorLiquido
 * @param excelContent
 * @returns
 */
export const convertFundosInvestimentos = (
  excelContent: ExcelContent
): Fundo[] => {
  const columns = {
    posicaoMercado: { header: "Posição", index: 1 },
    valorLiquido: { header: "Valor Líquido", index: 6 },
  };

  const { section } = findExcelSectionByTitleAndHeader({
    excelContent,
    title: "Fundos de Investimentos",
    headerCells: Object.values(columns).map((col) => col.header),
  });

  return section.map((row) => ({
    nome: row[0].toString(),
    posicaoMercado: parseExcelNumber(row[columns.posicaoMercado.index]),
    valorLiquido: parseExcelNumber(row[columns.valorLiquido.index]),
  }));
};

/**
 * Convert carteira XP excel content into ynab transactions
 */
export const convertCarteiraXpXlsTo = ({
  excelContent,
}: {
  excelContent: ExcelContent;
}): Carteira => {
  return {
    fiis: convertFundosImobiliarios(excelContent),
    acoes: convertAcoes(excelContent),
    rendaFixa: convertRendaFixa(excelContent),
    fundos: convertFundosInvestimentos(excelContent),
  };
};
