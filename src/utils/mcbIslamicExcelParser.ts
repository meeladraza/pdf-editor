import * as XLSX from "xlsx";
import { TransactionRow } from "../types";
import { formatDateShort } from "./formatDate";
import { formatNumber } from "./faisalExcelParser";

export { formatNumber };

export const parseMcbIslamicExcelFile = (file: File): Promise<TransactionRow[]> => {
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
        // col 0: Tran Date
        // col 1: Value Date
        // col 2: Tran Br.
        // col 3: Tran Description
        // col 4: Narrative / Addl Text
        // col 5: Ext. Reference Text
        // col 6: Instrument No
        // col 7: Debit
        // col 8: Credit
        // col 9: Balance

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0] && !row[3]) continue;

          const transaction: TransactionRow = {
            date: formatDateShort(row[0]) || "",
            valueDate: row[1] ? formatDateShort(row[1]) : "",
            tranBranch: row[2] ? String(row[2]) : "",
            particulars: row[3] ? String(row[3]) : "",
            narrative: row[4] ? String(row[4]) : "",
            extReference: row[5] ? String(row[5]) : "",
            instNo: row[6] ? String(row[6]) : "",
            debit: row[7] ? String(row[7]) : "",
            credit: row[8] ? String(row[8]) : "",
            balance: row[9] ? String(row[9]) : "",
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
