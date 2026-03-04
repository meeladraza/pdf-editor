import * as XLSX from "xlsx";
import { FaisalTransactionRow } from "../types";
import { formatDate } from "./formatDate";

export const parseFaisalExcelFile = (
  file: File
): Promise<FaisalTransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: "",
        }) as any[][];

        const transactions: FaisalTransactionRow[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];

          // Scan every cell — "opening balance" may be in any column depending on the file
          const isOpeningBal = row.some(
            (cell: unknown) =>
              cell != null &&
              String(cell).toLowerCase().includes("opening balance"),
          );

          // Narration: prefer column 2, but if it's empty look for the cell that holds
          // the opening-balance text (covers column-shifted Excel layouts)
          const narrationRaw = isOpeningBal
            ? (row.find(
                (cell: unknown) =>
                  cell != null &&
                  String(cell).toLowerCase().includes("opening balance"),
              ) as string) || ""
            : row[2]
              ? String(row[2])
              : "";

          // Skip truly empty rows, but keep opening balance rows even if postingDate is absent
          if (!row[0] && !isOpeningBal) continue;

          const transaction: FaisalTransactionRow = {
            postingDate: formatDate(row[0]) || "",
            effectiveDate: formatDate(row[1]) || "",
            narration: narrationRaw,
            referenceNo: row[3] ? String(row[3]) : "",
            withdrawal: row[4] ? String(row[4]) : "",
            deposit: row[5] ? String(row[5]) : "",
            balance: row[6] ? String(row[6]) : "",
            isOpeningBalance: isOpeningBal,
          };

          transactions.push(transaction);
        }

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsBinaryString(file);
  });
};

export const formatNumber = (value: string | number): string => {
  if (value === "" || value === null || value === undefined) return "";
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
