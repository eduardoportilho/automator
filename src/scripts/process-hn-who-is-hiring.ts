#!/usr/bin/env /opt/homebrew/bin/ts-node

import { osxCopy, osxPaste } from "../utils/clipboard/clipboard";
import { processHnWhoIsHiring } from "../services/process-hn-who-is-hiring/process-hn-who-is-hiring";

// HN content should be on clipboard - @see `src/devtools/hn-who-is-hiring.js`
const hnContent = osxPaste();
const processed = processHnWhoIsHiring(hnContent);
osxCopy(processed);
