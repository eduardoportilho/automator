import { readPdfAsArrays } from "../../utils/read-pdf/read-pdf";

export const readAguaQdl = async (filePath: string) => {
  console.log(`🔦 Reading PDF (${filePath})...\n`);
  const rows = await readPdfAsArrays(filePath);

  // [
  //   "Data de Leitura ANTERIOR......................................................",
  //   "16/09/2024",
  //   ",",
  // ]
  const rowLeituraAnterior = rows.find(
    (row) => row.length > 1 && row[0].includes("Data de Leitura ANTERIOR")
  );

  // [
  //   "Data de Leitura ATUAL.............................................................",
  //   "15/10/2024",
  // ]
  const rowLeituraAtual = rows.find(
    (row) => row.length > 1 && row[0].includes("Data de Leitura ATUAL")
  );

  // SE06 LT.01 EDUARDO PILLA PORTILHO A20L061585 1.800 1.859 59 339,25 339,30
  const myRow = rows.find(
    (row) => row.length > 2 && row[2] === "EDUARDO PILLA PORTILHO"
  );

  const [
    setor,
    lote,
    nome,
    codigo,
    medicaoMesAnterior,
    medicaoMes,
    consumoM3,
    calculoBrl,
    valorAPagar,
  ] = myRow;

  return {
    dataLeituraAnterior: rowLeituraAnterior ? rowLeituraAnterior[1] : undefined,
    dataLeituraAtual: rowLeituraAtual ? rowLeituraAtual[1] : undefined,
    setor,
    lote,
    nome,
    codigo,
    medicaoMesAnterior,
    medicaoMes,
    consumoM3,
    calculoBrl,
    valorAPagar,
  };
};
