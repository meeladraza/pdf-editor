import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// HBL Excel columns: Date | Description | Debit | Credit | Current Balance

const formatDate = (val: any): string => {
  if (!val) return "";
  const s = String(val).trim();
  if (!s) return "";

  // Excel serial number
  if (typeof val === "number" && val > 25568) {
    const epoch = new Date(1899, 11, 30);
    const date  = new Date(epoch.getTime() + val * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      const d = date.getDate().toString().padStart(2, "0");
      const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      return `${d}${months[date.getMonth()]}${String(date.getFullYear()).slice(2)}`;
    }
  }
  return s;
};

const cleanNumber = (val: any): string => {
  if (!val && val !== 0) return "";
  const s = String(val).trim().replace(/,/g, "");
  if (!s || isNaN(Number(s))) return String(val).trim();
  return Number(s).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseHBLExcelFile = (file: File): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: true,
          defval: "",
        }) as any[][];

        const transactions: TransactionRow[] = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          // Skip completely empty rows
          if (!row[0] && !row[2] && !row[3] && !row[4] && !row[5]) continue;

          const description = row[2] ? String(row[2]).trim() : "";
          const descLower   = description.toLowerCase();

          // Skip header rows
          if (descLower === "description" || descLower === "details") continue;

          const isOpening = descLower.includes("brought forward") ||
                            descLower.includes("opening balance") ||
                            descLower.includes("balance b/f");
          const isClosing = descLower.includes("carried forward") ||
                            descLower.includes("closing balance") ||
                            descLower.includes("balance c/f");

          transactions.push({
            date:             formatDate(row[0]),
            particulars:      description,
            debit:            row[3] ? cleanNumber(row[3]) : "",
            credit:           row[4] ? cleanNumber(row[4]) : "",
            balance:          row[5] ? String(row[5]).trim() : "",
            isOpeningBalance: isOpening,
            isClosingBalance: isClosing,
          });
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
