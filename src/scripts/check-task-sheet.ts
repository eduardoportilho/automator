#!/usr/bin/env /opt/homebrew/bin/ts-node

// Usage:
// $ chmod +x ./src/scripts/check-task-sheet.ts
// $ ./src/scripts/check-task-sheet.ts

import {
  readTasksFromCtrlSheet,
  Task,
} from "../services/read-tasks-from-ctrl-sheet/read-tasks-from-ctrl-sheet";
import { displayMacOsNotificationTN as displayMacOsNotification } from "../utils/notifications/notifications";

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
    const tasks = await readTasksFromCtrlSheet();
    const { due, willBeDueInNearFuture } = tasks;

    const notificationText = [
      buildNotificationMessage("⛔️ Vencidas", due),
      buildNotificationMessage("⚠️ Próximas", willBeDueInNearFuture),
    ]
      .filter(Boolean)
      .join("\n");

    if (notificationText) {
      console.log(notificationText);
      displayMacOsNotification({
        title: "Tarefas:",
        notificationText,
        url: "https://docs.google.com/spreadsheets/d/1--ReOsqh_nc9UNyEJauiEMrP0IxGQV0s4LkY2z-uNfU/edit?gid=2087879779#gid=2087879779",
        sound: "Frog",
      });
    }

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
