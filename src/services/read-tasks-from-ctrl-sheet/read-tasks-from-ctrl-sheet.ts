import {
  setDate,
  parse,
  isBefore,
  addDays,
  getMonth,
  endOfDay,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { getSheetRanges } from "../../utils/sheets/sheets";
import { CONTROLE_SPREADSHEET_ID, TASKS_SHEET_TITLE } from "../../constants";
import { isInteger } from "../../utils/number/number";
import { MONTHS_MMM_PT_BR } from "../../utils/date/date";

// Tarefas que vão vencer no futuro próximo: vencem nos próximos x dias
export const NEAR_FUTURE_DUE_DAYS = 5;

export interface Task {
  task: string;
}

interface CtrlSheetTasks {
  due: Task[];
  willBeDueInNearFuture: Task[];
}

/**
 * Read current month tasks from spreadsheet
 * @returns
 *  - due: Tasks that are not completed and due
 *  - willBeDueInNearFuture: Tasks that are not completed and will be due in the near future
 */
export const readTasksFromCtrlSheet = async (): Promise<CtrlSheetTasks> => {
  const [sheetContent] = await getSheetRanges(
    CONTROLE_SPREADSHEET_ID,
    [`${TASKS_SHEET_TITLE}!A:Z`],
    "FORMATTED_VALUE"
  );
  const [headerRow, ...taskRows] = sheetContent;

  const now = new UTCDate();
  const currentMonthMmm = MONTHS_MMM_PT_BR[getMonth(now)];
  const nearFutureDueDate = endOfDay(addDays(now, NEAR_FUTURE_DUE_DAYS));

  const currentMonthColIndex = headerRow.findIndex((header) =>
    header.toString().includes(currentMonthMmm)
  );

  // Read all task rows
  const tasks = taskRows
    .map((row) => {
      if (row.length < 2) {
        return null;
      }

      const [day, task] = row;

      if (!day) {
        return null;
      }

      const completionDateStr = row[currentMonthColIndex];

      // HERE WE CHECK IF TASK IS COMPLETED
      // const isCompleted =
      //   completionDateStr &&
      //   /^[0123]?\d\/[01]?\d$/.test(completionDateStr.toString());
      const isCompleted =
        completionDateStr &&
        !["⛔️", "🔜"].includes(completionDateStr.toString());
      // HERE WE CHECK IF TASK IS COMPLETED

      const taskDueDate = isInteger(day.toString())
        ? setDate(now, parseInt(day.toString()))
        : undefined;
      const isDue = !isCompleted && taskDueDate && isBefore(taskDueDate, now);
      // vai vencer no futuro próximo
      const willBeDueInNearFuture =
        !isCompleted &&
        taskDueDate &&
        !isDue &&
        isBefore(taskDueDate, nearFutureDueDate);

      return {
        day,
        task: task.toString(),
        dueDate: taskDueDate,
        isCompleted,
        isDue,
        willBeDueInNearFuture,
      };
    })
    .filter(Boolean);

  const notCompleted = tasks.filter(({ isCompleted }) => !isCompleted);
  const dueTasks = notCompleted.filter(({ isDue }) => isDue);
  const willBeDueInNearFutureTasks = notCompleted.filter(
    ({ willBeDueInNearFuture }) => willBeDueInNearFuture
  );
  // const completed = tasks.filter(({ isCompleted }) => isCompleted);
  // console.log(`>>>notCompleted:`, notCompleted);
  // console.log(`>>>completed:`, completed);
  // console.log(`>>>dueTasks:`, dueTasks);
  // console.log(`>>>willBeDueInNearFutureTasks:`, willBeDueInNearFutureTasks);

  return {
    due: dueTasks,
    willBeDueInNearFuture: willBeDueInNearFutureTasks,
  };
};
