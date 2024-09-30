#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts
import "dotenv/config";

console.log(`Hello world`);
console.log(process.env.YNAB_ACCESS_TOKEN);
