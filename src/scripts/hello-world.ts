#!/usr/bin/env /opt/homebrew/bin/ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { sendMessage } from "../services/api/telegram/telegram";
import { fetchCotacaoDolar } from "../services/fetch-dolar/fetch-dolar";
import { checkLastUpdateToday } from "../utils/local-db/local-db";
import { getArgs, getEnvVars } from "../utils/scripts";

(async () => {
  try {
    const [arg] = getArgs();
    const [token, chatId] = getEnvVars([
      "TELEGRAM_ARMINIO_BOT_API_TOKEN",
      "TELEGRAM_EDUARDOPORTILHO_USER_ID",
    ]);

    const updatedToday = checkLastUpdateToday("hello-world-last-update");

    console.log(`was updated today? [${updatedToday}]"`);
    console.log(`Hello world! Arg is [${arg}]"`);

    const { bid } = await fetchCotacaoDolar();

    sendMessage({
      token,
      chatId,
      text: `Hello World! O dolar hoje é ${bid}`,
    });

    return `Hello world! Arg is [${arg}]"`;
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
