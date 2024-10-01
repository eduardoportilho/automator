export const getArgs = ({
  count,
  errorMessage,
}: {
  count: number;
  errorMessage: string;
}) => {
  // Remove first 2: command, file
  const args = process.argv.slice(2);

  if (args.length !== count) {
    console.error(errorMessage);
    process.exit();
  }

  return args;
};

export const checkEnvVars = (varNames: string[]) => {
  const missing = varNames.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(
      `Missing envirnonment var(s): ${missing.join(
        ", "
      )}. Please add them to '.envrc'.`
    );
    console.info("More info at `https://direnv.net/`:");
    console.info(`$ echo export VAR_NAME=abc123 > .envrc`);
    console.info(`$ direnv allow .`);
    process.exit();
  }
};
