import { existsSync } from "fs";
import { isToday } from "date-fns";
import { nowIsoString } from "../date/date";
import { readFile, writeFile } from "../file";
import { getEnvVars } from "../scripts";

/**
 * Check db entry for an update date:
 * - If the db entry is not present OR if it is in the past: set entry to NOW and return false
 * - If the db entry is today: return true
 * @param dbKey
 * @returns
 */
export const checkLastUpdateToday = (dbKey: string) => {
  const db = readLocalDb();
  const lastUpdateIso = db[dbKey];

  const isLastUpdateToday = lastUpdateIso ? isToday(lastUpdateIso) : false;

  if (!lastUpdateIso || !isLastUpdateToday) {
    db[dbKey] = nowIsoString();
    writeLocalDb(db);
    return false;
  }

  return true;
};

export const readLocalDb = () => {
  const [automatorDbFile] = getEnvVars(["AUTOMATOR_DB_FILE"]);
  const content = existsSync(automatorDbFile)
    ? readFile(automatorDbFile)
    : "{}";
  return JSON.parse(content);
};

export const writeLocalDb = (db: any) => {
  const [automatorDbFile] = getEnvVars(["AUTOMATOR_DB_FILE"]);
  const content = JSON.stringify(db);
  return writeFile(automatorDbFile, content);
};
