#!/usr/bin/env /opt/homebrew/bin/ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { readAguaQdl } from "../services/read-agua-qdl/read-agua-qdl";
import { getArgs } from "../utils/scripts";

(async () => {
  try {
    // const args = getArgs();

    readAguaQdl(
      "/Users/eduardoportilho/Downloads/2025-03-w3/RATEIO DE ÁGUA 2024- OUTUBRO.pdf"
    );

    // console.log(`Hello world! Args are [${args.join(", ")}]"`);
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
