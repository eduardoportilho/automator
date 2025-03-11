#!/usr/bin/env /opt/homebrew/bin/ts-node
import { getArgs } from "../utils/scripts";
import { osxCopy } from "../utils/clipboard/clipboard";
import { readAguaQdl } from "../services/read-agua-qdl/read-agua-qdl";

(async () => {
  const [inputPath] = getArgs({
    requiredCount: 1,
    errorMessage: `Missing arguments. Usage: read-agua-qdl-to-clipboard.ts <path/to/file.pdf>`,
  });

  try {
    const {
      dataLeituraAtual,
      medicaoMesAnterior,
      medicaoMes,
      consumoM3,
      calculoBrl,
      valorAPagar,
    } = await readAguaQdl(inputPath);

    osxCopy(
      [
        dataLeituraAtual,
        medicaoMesAnterior,
        medicaoMes,
        consumoM3,
        calculoBrl,
        valorAPagar,
      ].join("\t")
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
