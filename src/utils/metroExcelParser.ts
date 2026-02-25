import * as XLSX from "xlsx";
import { TransactionRow } from "../types";
import { formatDate } from "./formatDate";
import { formatNumber } from "./faisalExcelParser";

export { formatNumber };

export const parseMetroExcelFile = (file: File): Promise<TransactionRow[]> => {
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

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const particularsRaw = row[1] ? String(row[1]) : "";
          const particLower = particularsRaw.toLowerCase();
          const isOpeningBalance = particLower.includes("opening balance");
          const isClosingBalance = particLower.includes("closing balance");

          // Skip truly empty rows but keep opening/closing balance rows
          if (!row[0] && !isOpeningBalance && !isClosingBalance) continue;

          const transaction: TransactionRow = {
            date: formatDate(row[0]) || "",
            particulars: particularsRaw,
            debit: row[2] ? String(row[2]) : "",
            credit: row[3] ? String(row[3]) : "",
            balance: row[4] ? String(row[4]) : "",
            isOpeningBalance,
            isClosingBalance,
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
