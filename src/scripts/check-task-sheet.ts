#!/usr/bin/env /opt/homebrew/bin/ts-node

// Usage:
// $ chmod +x ./src/scripts/check-task-sheet.ts
// $ ./src/scripts/check-task-sheet.ts

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import {
  readTasksFromCtrlSheet,
  Task,
  NEAR_FUTURE_DUE_DAYS,
} from "../services/read-tasks-from-ctrl-sheet/read-tasks-from-ctrl-sheet";
import { displayMacOsNotificationTN as displayMacOsNotification } from "../utils/notifications/notifications";
import { checkLastUpdateToday } from "../utils/local-db/local-db";
import { checkBoolEnvVar } from "../utils/scripts";
import { TASKS_SHEET_URL } from "../constants";
import { fetchCotacaoDolar } from "../services/fetch-dolar/fetch-dolar";

const buildTituloNotificacao = async () => {
  const cotacao = await fetchCotacaoDolar();
  const data = format(new Date(), "- d/M eeeeee", { locale: ptBR });

  return ["Tarefas", data, cotacao ? `(💰 Dolar: ${cotacao.bid} 💰)` : null]
    .filter(Boolean)
    .join(" ");
};

const buildNotificationMessage = (label: string, tasks: Task[]) => {
  if (tasks.length === 0) {
    return null;
  }

  return `${label} (${tasks.length}): ${tasks
    .map(({ task }) => `${task}`)
    .join(" | ")}`;
};

(async () => {
  try {
    const runOnceADay = checkBoolEnvVar("KMVAR_RUN_ONCE_A_DAY");
    const hasScriptBeenExecutedToday =
      runOnceADay && checkLastUpdateToday("check-task-sheet/last-update");

    if (hasScriptBeenExecutedToday) {
      console.log("❌ The script has already been executed today, aborting.");
      return;
    }
    const { due, willBeDueInNearFuture } = await readTasksFromCtrlSheet();

    const notificationText =
      due.length || willBeDueInNearFuture.length
        ? [
            buildNotificationMessage("⛔️ Vencidas", due),
            buildNotificationMessage("⚠️ Próximas", willBeDueInNearFuture),
          ]
            .filter(Boolean)
            .join("\n")
        : `🏝️ Nada por aqui! Nenhuma tarefa vencida, ou vencendo nos próximos ${NEAR_FUTURE_DUE_DAYS} dias! 😌🫡`;

    const tituloNotificacao = await buildTituloNotificacao();

    displayMacOsNotification({
      title: tituloNotificacao,
      notificationText,
      url: TASKS_SHEET_URL,
      sound: "Frog",
    });

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
