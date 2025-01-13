import { Bot } from "grammy";

/**
 * @see https://github.com/grammyjs/examples/blob/main/send-message.ts
 * @see https://core.telegram.org/bots/api#sendmessage
 */
export const sendMessage = ({
  chatId,
  text,
  token,
}: {
  chatId: number | string;
  text: string;
  token: string;
}) => {
  const bot = new Bot(token);

  // 2. Send message to user `1234` (find user IDs with https://t.me/getidsbot)
  // https://core.telegram.org/bots/api#formatting-options
  bot.api.sendMessage(chatId, text, { parse_mode: "Markdown" });
};
