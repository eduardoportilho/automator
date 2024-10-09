#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { fetchPatrimonioSheet } from "../services/patrimonio-sheet/patrimonio-sheet";

(async () => {
  try {
    console.log(`Hello world`);
    // console.log(process.env.YNAB_ACCESS_TOKEN);

    await fetchPatrimonioSheet();

    console.log("Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
