#!/usr/bin/env /opt/homebrew/bin/ts-node

// $ ts-node ./src/scripts/get-state-classes.ts /Users/eduardoportilho/dev/safwd/saf/frontend/subscribe-ui/src/Button/styles.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { readFile } from "../utils/file";
import { getArgs } from "../utils/scripts";

(async () => {
  try {
    const [inputFile] = getArgs();
    const content = readFile(inputFile);

    // console.log(inputFile);
    // console.log(content.slice(0, 1000));

    const filtered = content
      .split(" ")
      .flatMap((row) => row.split("'"))
      .flatMap((part) => part.split(" "))
      .filter((token) => token.match(/^(focus|hover|active):/))
      .map((token) => token.replace(/^.+:/, ""));
    const sortedUniq = [...new Set(filtered)].sort();
    console.log(sortedUniq.join("\n"));
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
