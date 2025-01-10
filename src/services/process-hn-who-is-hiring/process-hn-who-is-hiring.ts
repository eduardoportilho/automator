import { osxCopy, osxPaste } from "../../utils/clipboard/clipboard";

export const processHnWhoIsHiringFromClipboard = () => {
  // HN content should be on clipboard - @see `src/devtools/hn-who-is-hiring.js`
  const hnContent = osxPaste();
  const processed = processHnWhoIsHiring(hnContent);
  osxCopy(processed);
};

const isWorkType = (col: string): boolean =>
  [/remote/gi, /full.?time/gi, /hybrid/gi, /on.?site/gi, /In.?person/gi].some(
    (regex) => regex.test(col)
  );

const isRole = (col: string): boolean =>
  [
    /Engineer/gi,
    /Frontend/gi,
    /Backend/gi,
    /Developer/gi,
    /Full.?Stack/gi,
  ].some((regex) => regex.test(col));

const isUrlCol = (col: string): boolean => /^https?:\/\//i.test(col);

const isRemoteEntry = (entry: string) => /remote/gi.test(entry);

/**
 * Process a HN who is hiring entry
 * @param entry
 * @returns
 */
export const processHnWhoIsHiringEntry = (entry: string): string => {
  if (!entry.includes("|")) {
    return entry;
  }

  const cols = entry.split("|").map((s) => s.trim());

  const { company, workType, role, url, other } = cols.reduce(
    (acc, col, index) => {
      if (index === 0) {
        acc.company = col;
      } else if (isWorkType(col)) {
        acc.workType.push(col);
      } else if (isRole(col)) {
        acc.role.push(col);
      } else if (isUrlCol(col)) {
        acc.url.push(col);
      } else {
        acc.other.push(col);
      }

      return acc;
    },
    {
      company: null,
      workType: [],
      role: [],
      url: [],
      other: [],
    }
  );

  return [company, ...workType, ...role, ...url, ...other]
    .filter(Boolean)
    .join(" | ");
};

export const processHnWhoIsHiring = (hnContent: string) => {
  const rows = hnContent.split("\n");

  const { remote, other, raw } = rows.reduce(
    (acc, row) => {
      if (row.includes("|")) {
        const processed = processHnWhoIsHiringEntry(row);
        if (isRemoteEntry(row)) {
          acc.remote.push(processed);
        } else {
          acc.other.push(processed);
        }
      } else {
        acc.raw.push(row);
      }

      return acc;
    },
    { remote: [], other: [], raw: [] }
  );

  return [
    "▶️▶️▶️ REMOTE:",
    ...remote,
    "▶️▶️▶️ OTHER:",
    ...other,
    "▶️▶️▶️ UNFORMATTED",
    ...raw,
  ].join("\n");
};

processHnWhoIsHiringFromClipboard();
