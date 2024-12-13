import { YnabTx } from "../types";
import { uploadYnabTxs } from "../services/upload-ynab-txs/upload-ynab-txs";
import { readFile } from "../utils/file";
import { getArgs, getEnvVars } from "../utils/scripts";
import { fetchYnabTxsAndFilterUnique } from "../services/fetch-ynab-txs-and-filter-unique/fetch-ynab-txs-and-filter-unique";

/**
 * 1. Read input path, budgetId, accountId, and accessToken from CLI args (print error and abort if not present)
 * 2. If accessToken is not on CLI args, read it from env
 * @returns
 */
export const getYnabCliArgs = () => {
  const scriptFileName = process.argv[1];
  const [path, budgetId, accountId, accessTokenFromArgs] = getArgs({
    requiredCount: 3,
    errorMessage: `Missing arguments. Usage: ${scriptFileName} <path/to/input> <budget-id> <account-id> <?access-token?>`,
  });

  let accessToken = accessTokenFromArgs;
  if (!accessToken) {
    const [accessTokenFromEnv] = getEnvVars(["YNAB_ACCESS_TOKEN"]);
    accessToken = accessTokenFromEnv;
  }
  return { path, budgetId, accountId, accessToken };
};

/**
 * 1. Read input path, budgetId, accountId, and accessToken from CLI args (print error and abort if not present)
 * 2. If accessToken is not on CLI args, read it from env
 * 3. Read input file and return content
 * @returns
 */
export const getYnabCliArgsAndReadFile = () => {
  const { path, ...rest } = getYnabCliArgs();

  const content = readFile(path);

  return { path, content, ...rest };
};

/**
 * 1. Fetch remote txs from the same date range of txs
 * 2. Remove txs from txs that already exists on remote
 * 3. Return unique txs from txs
 * @returns
 */
export const removeDuplicates = async ({
  budgetId,
  accountId,
  accessToken,
  txs,
}: {
  budgetId: string;
  accountId: string;
  accessToken: string;
  txs: YnabTx[];
}) => {
  console.log("Fetching transactions from YNAB to remove duplicates...");
  const { uniqueTxs, duplicateTxs } = await fetchYnabTxsAndFilterUnique({
    budgetId,
    accountId,
    accessToken,
    originalTxs: txs,
  });
  console.log(
    `Found ${uniqueTxs.length} new in ${txs.length} imported transactions`
  );
  if (duplicateTxs.length > 0) {
    console.log(
      "Duplicates:",
      duplicateTxs.map(
        ({ date, payee_name, amount }) => `${date}  ${payee_name}  ${amount}`
      ),
      "\n"
    );
  }

  return uniqueTxs;
};

/**
 * Upload transactions to YNAB (account id should be present in each tx)
 * @returns
 */
export const uploadTxsToYnab = async ({
  budgetId,
  accessToken,
  txs,
}: {
  budgetId: string;
  accessToken: string;
  txs: YnabTx[];
}) => {
  console.log(`Uploading ${txs.length} new transactions...`);
  return uploadYnabTxs({
    budgetId,
    accessToken,
    txs,
  });
};
