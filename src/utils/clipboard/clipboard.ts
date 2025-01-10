import execa from "execa";
// TODO:
// - Update execa version to latest
// - Understand why ESM doesn't work (https://github.com/sindresorhus/execa/issues/489)
// - Fix

const env = {
  LC_CTYPE: "UTF-8",
};

export const osxPaste = (): string => {
  const { stdout } = execa.commandSync("pbpaste", { env });
  return stdout;
};

export const osxCopy = (data: string) => {
  execa.commandSync("pbcopy", {
    input: data,
    env,
  });
};
