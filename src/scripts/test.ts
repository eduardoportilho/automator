#!/usr/bin/env /opt/homebrew/bin/ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { getArgs } from "../utils/scripts";

(async () => {
  try {
    const args = getArgs();

    console.log(`Hello world! Args are [${args.join(", ")}]"`);
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
