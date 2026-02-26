import * as XLSX from "xlsx";
import { TransactionRow } from "../types";
import { formatDate } from "./formatDate";
import { formatNumber } from "./faisalExcelParser";

export { formatNumber };

export const parseSonehriExcelFile = (
  file: File,
): Promise<TransactionRow[]> => {
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

        const transactions: TransactionRow[] = [];

        // Columns:
        // col 0: Booking Date
        // col 1: Value Date
        // col 2: Reference
        // col 3: Description
        // col 4: Cheque No
        // col 5: Debit
        // col 6: Credit
        // col 7: Closing Balance

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const descriptionRaw = row[3] ? String(row[3]) : "";
          const descLower = descriptionRaw.toLowerCase();
          const isOpeningBalance = descLower.includes("balance at period start");

          if (!row[0] && !isOpeningBalance) continue;

          const transaction: TransactionRow = {
            date: formatDate(row[0]) || "",
            valueDate: row[1] ? String(row[1]) : "",
            instNo: row[2] ? String(row[2]) : "",
            particulars: descriptionRaw,
            docNo: row[4] ? String(row[4]) : "",
            debit: row[5] ? String(row[5]) : "",
            credit: row[6] ? String(row[6]) : "",
            balance: row[7] ? String(row[7]) : "",
            isOpeningBalance,
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
