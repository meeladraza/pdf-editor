import * as XLSX from "xlsx";
import { TransactionRow } from "../types";
import { formatDate } from "./formatDate";
import { formatNumber } from "./faisalExcelParser";

export { formatNumber };

export const parseDubaiExcelFile = (file: File): Promise<TransactionRow[]> => {
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
        // col 0: Posting Date
        // col 1: Instrument Number
        // col 2: Transaction Details
        // col 3: Transaction Ref. No.
        // col 4: Debit
        // col 5: Credit
        // col 6: Balance

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0] && !row[2]) continue;

          const transaction: TransactionRow = {
            date: formatDate(row[0]) || "",
            instNo: row[1] ? String(row[1]) : "",
            particulars: row[2] ? String(row[2]) : "",
            docNo: row[3] ? String(row[3]) : "",
            debit: row[4] ? String(row[4]) : "",
            credit: row[5] ? String(row[5]) : "",
            balance: row[6] ? String(row[6]) : "",
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
