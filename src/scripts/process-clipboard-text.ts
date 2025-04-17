#!/usr/bin/env ts-node

import { camelCase, kebabCase, snakeCase, startCase, lowerCase } from "lodash";
import { osxCopy, osxPaste } from "../utils/clipboard/clipboard";
import { getArgs } from "../utils/scripts";

(async () => {
  try {
    const [action] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: process-clipboard-text.ts <action>`,
    });

    console.log(`>>> Processing clipboart text with action '${action}'...`);

    const clipboardText = osxPaste();
    let processed = clipboardText;

    switch (action) {
      case "kebabCase":
        processed = kebabCase(clipboardText);
        break;
      case "camelCase":
        processed = camelCase(clipboardText);
        break;
      case "snakeCase":
        processed = snakeCase(clipboardText);
        break;
      case "titleCase":
        processed = startCase(lowerCase(clipboardText)); // "The Quick Brown Fox Jumps over the Lazy Dog"
        break;
      default:
        console.error(`Unknown action: ${action}`);
    }

    osxCopy(processed);

    console.log(
      `\nDone! The results [${processed}] were copied to the clipboard.`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
