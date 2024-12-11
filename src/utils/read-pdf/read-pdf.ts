import { readFileSync } from "fs";
import pdf from "pdf-parse";

export const readPdf = async (path: string) => {
  let dataBuffer = readFileSync(path);
  const data = await pdf(dataBuffer);

  return data.text;
};
