#!/usr/bin/env /opt/homebrew/bin/ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { fetchCotacaoDolar } from "../services/fetch-dolar/fetch-dolar";
import { checkLastUpdateToday } from "../utils/local-db/local-db";
import { getArgs } from "../utils/scripts";

(async () => {
  try {
    const [arg] = getArgs();

    const updatedToday = checkLastUpdateToday("hello-world-last-update");

    console.log(`was updated today? [${updatedToday}]"`);
    console.log(`Hello world! Arg is [${arg}]"`);

    await fetchCotacaoDolar();
    return `Hello world! Arg is [${arg}]"`;
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
