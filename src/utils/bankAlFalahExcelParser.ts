import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Formats any date value as "20 NOV 23"
const formatDDMMMYY = (dateValue: any): string => {
  if (!dateValue) return "";
  let date: Date;

  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "number" && dateValue > 25568) {
    const excelEpoch = new Date(1899, 11, 30);
    date = new Date(excelEpoch.getTime() + dateValue * 86400 * 1000);
  } else if (typeof dateValue === "string") {
    date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      date = new Date(dateValue.replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3"));
    }
  } else {
    return String(dateValue);
  }

  if (isNaN(date.getTime())) return String(dateValue);

  const d = date.getDate().toString().padStart(2, "0");
  const mon = MONTHS[date.getMonth()];
  const y = date.getFullYear().toString().slice(-2);
  return `${d} ${mon} ${y}`;
};

export const parseBankAlFalahExcelFile = (file: File): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: "",
        }) as any[][];

        const transactions: TransactionRow[] = [];

        // Columns:
        // col 0: Post Date
        // col 1: Description
        // col 2: Cheque/Inst #
        // col 3: Value Date
        // col 4: Debit Amount
        // col 5: Credit Amount
        // col 6: Balance
        // col 7: Initiated Branch

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0] && !row[1]) continue;

          const description = row[1] ? String(row[1]) : "";
          const upper = description.toUpperCase();
          const isOpening = upper.includes("RIES FOR PERIOD") || upper.includes("PERIOD ***");
          const isClosing = upper.includes("CLOSING BALANCE");

          const transaction: TransactionRow = {
            date: row[0] ? formatDDMMMYY(row[0]) : "",
            particulars: description,
            instNo: row[2] ? String(row[2]) : "",
            valueDate: row[3] ? formatDDMMMYY(row[3]) : "",
            debit: row[4] ? String(row[4]) : "",
            credit: row[5] ? String(row[5]) : "",
            balance: row[6] ? String(row[6]) : "",
            tranBranch: row[7] ? String(row[7]) : "",
            isOpeningBalance: isOpening,
            isClosingBalance: isClosing,
          };

          transactions.push(transaction);
        }

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};
