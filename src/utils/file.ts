import path from "path";
import { readFileSync, readdirSync, renameSync } from "fs";

export const readFile = (filePath: string): string =>
  readFileSync(filePath, "utf8");

export const listFiles = ({
  folderPath,
  extension,
}: {
  folderPath: string;
  extension?: string;
}) =>
  readdirSync(folderPath)
    .filter(
      (fileName) =>
        !extension || fileName.toLowerCase().endsWith(extension.toLowerCase())
    )
    .map((fileName) => path.join(folderPath, fileName));

export const renameFile = (filePath: string, newName: string) => {
  const pathObject = path.parse(filePath);
  const newFilePath = path.format({
    ...pathObject,
    base: undefined,
    name: newName,
  });

  console.log(`⚙️ Renaming "${filePath}" to "${newFilePath}"...\n`);
  renameSync(filePath, newFilePath);
};
