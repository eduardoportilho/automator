import { AluguelReportEntry } from "../../types";
import { readPdf } from "../../utils/read-pdf/read-pdf";
import {
  isEstadiaReport,
  processEstadiaReport,
} from "../process-estadia-report/process-estadia-report";
import { processArpoadorReport } from "../process-arpoador-report/process-arpoador-report";
import {
  processBluechipReport,
  isBlueChipReport,
} from "../process-bluechip-report/process-bluechip-report";

export const readAluguelReportPdf = async (
  filePath: string
): Promise<{ entry: AluguelReportEntry; isAirbnb: boolean }> => {
  console.log(`🔦 Reading PDF (${filePath})...\n`);
  const pdfContent = await readPdf(filePath);

  if (pdfContent.trim().length === 0) {
    throw new Error("PDF is empty (not OCR'd?), aborting...");
  }

  // console.log(`>>>---<<<`, pdfContent, `>>>---<<<`);

  const isBlueChip = isBlueChipReport(pdfContent);
  const isEstadia = isEstadiaReport(pdfContent);

  const entry = isBlueChip
    ? processBluechipReport(pdfContent)
    : isEstadia
    ? processEstadiaReport(pdfContent)
    : processArpoadorReport(pdfContent);

  return { entry, isAirbnb: isEstadia };
};
