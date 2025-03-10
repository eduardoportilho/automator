import { readFileSync } from "fs";
import pdf from "pdf-parse";
import { Item, PdfReader } from "pdfreader";

export const readPdf = async (path: string) => {
  let dataBuffer = readFileSync(path);
  const data = await pdf(dataBuffer);

  return data.text;
};

const isItem = (entry: unknown): entry is Item =>
  entry &&
  typeof (entry as Item).x === "number" &&
  typeof (entry as Item).y === "number" &&
  typeof (entry as Item).text === "string";

export const readPdfAsArrays = (path: string): Promise<string[][]> => {
  return new Promise(function (resolve, reject) {
    const rows: string[][] = [];
    let rowY: number = undefined;
    let row: string[] = [];

    new PdfReader().parseFileItems(path, (err, item) => {
      if (err) {
        reject(err);
      }
      if (!item) {
        rows.push(row);
        resolve(rows);
      }
      if (isItem(item)) {
        if (item.y !== rowY) {
          rows.push(row);
          row = [item.text];
          rowY = item.y;
        } else {
          row.push(item.text);
        }
      }
    });
  });
};
