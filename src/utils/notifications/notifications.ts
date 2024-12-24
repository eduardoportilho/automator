type Sound =
  | "Basso"
  | "Blow"
  | "Bottle"
  | "Frog"
  | "Funk"
  | "Glass"
  | "Hero"
  | "Morse"
  | "Ping"
  | "Pop"
  | "Purr"
  | "Sosumi"
  | "Submarine"
  | "Tink";

/**
 * Display notification using osascript
 * @see
 * https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_cmds.html#//apple_ref/doc/uid/TP40000983-CH216-SW224
 * https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayNotifications.html#//apple_ref/doc/uid/TP40016239-CH61-SW1
 */
export const displayMacOsNotification = ({
  notificationText,
  title,
  subtitle,
  sound,
}: {
  notificationText: string;
  title?: string;
  subtitle?: string;
  sound?: Sound;
}) => {
  const appleScriptParts = [
    `display notification "${notificationText}"`,
    title ? `with title "${title}"` : null,
    subtitle ? `subtitle "${subtitle}"` : null,
    sound ? `sound name "${sound}"` : null,
  ];
  const cmd = `osascript -e '${appleScriptParts.join(" ")}'`;

  require("child_process").exec(cmd);
};

/**
 * Display notification using terminal-notifier
 * @see https://github.com/julienXX/terminal-notifier
 */
export const displayMacOsNotificationTN = ({
  notificationText,
  title,
  subtitle,
  sound,
  url,
  group,
}: {
  notificationText: string;
  title?: string;
  subtitle?: string;
  sound?: Sound | "default";
  url?: string;
  group?: string;
}) => {
  const options = [
    `-message '${notificationText}'`,
    title ? `-title '${title}'` : null,
    subtitle ? `-subtitle '${subtitle}'` : null,
    group ? `-group '${group}'` : null,
    sound ? `-sound '${sound}'` : null,
    url ? `-open '${url}'` : null,
  ];
  const cmd = `terminal-notifier ${options.join(" ")}`;
  console.log(`\n\n>>>`, cmd);
  require("child_process").exec(cmd);
};
