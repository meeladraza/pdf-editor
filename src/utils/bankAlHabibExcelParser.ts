import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

const formatDateDMY = (dateValue: any): string => {
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
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export const parseBankAlHabibExcelFile = (file: File): Promise<TransactionRow[]> => {
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
        // col 0: Date
        // col 1: Value Date
        // col 2: Instrument / Doc No.
        // col 3: Details
        // col 4: Debit
        // col 5: Credit
        // col 6: Balance

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0] && !row[3]) continue;

          const details = row[3] ? String(row[3]) : "";
          const isOpening = details.toLowerCase().includes("opening balance");
          const isClosing = details.toLowerCase().includes("closing balance");

          const transaction: TransactionRow = {
            date: formatDateDMY(row[0]),
            valueDate: row[1] ? formatDateDMY(row[1]) : "",
            instNo: row[2] ? String(row[2]) : "",
            particulars: details,
            debit: row[4] ? String(row[4]) : "",
            credit: row[5] ? String(row[5]) : "",
            balance: row[6] ? String(row[6]) : "",
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
    reader.readAsBinaryString(file);
  });
};
