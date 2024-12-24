export const getArgs = ({
  requiredCount = 0,
  errorMessage = "Missing arguments.",
}: {
  requiredCount?: number;
  errorMessage?: string;
} = {}) => {
  // Remove first 2: command, file
  const args = process.argv.slice(2);

  if (args.length < requiredCount) {
    console.error(errorMessage);
    process.exit();
  }

  return args;
};

export const getEnvVars = (varNames: string[]): string[] => {
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

  return varNames.map((varName) => process.env[varName]);
};

export const checkBoolEnvVar = (varName: string): boolean => {
  return (process.env[varName] ?? "false").toLowerCase() === "true";
};
