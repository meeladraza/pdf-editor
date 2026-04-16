import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// BML columns: Date | Value Date | InstNo | Particulars | Debit | Credit | Balance

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Format: "20 NOV 23"
const formatDate = (val: any): string => {
  if (!val) return "";
  let date: Date | null = null;

  if (val instanceof Date) {
    date = val;
  } else if (typeof val === "number" && val > 25568) {
    date = new Date(new Date(1899, 11, 30).getTime() + val * 86400 * 1000);
  } else {
    const s = String(val).trim();
    if (!s) return "";

    // DD/MM/YYYY
    const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmy) date = new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);

    // YYYY-MM-DD (ISO)
    if (!date) {
      const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (iso) date = new Date(+iso[1], +iso[2] - 1, +iso[3]);
    }

    if (!date) date = new Date(s);
    if (!date || isNaN(date.getTime())) return s;
  }

  if (!date || isNaN(date.getTime())) return String(val);

  const d   = date.getDate().toString().padStart(2, "0");
  const mon = MONTHS[date.getMonth()];
  const y   = date.getFullYear().toString().slice(-2);
  return `${d} ${mon} ${y}`;
};

const cleanNumber = (val: any): string => {
  if (!val && val !== 0) return "";
  const s = String(val).trim().replace(/,/g, "");
  if (!s || isNaN(Number(s))) return String(val).trim();
  return Number(s).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseBMLExcelFile = (file: File): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data     = e.target?.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1, raw: true, defval: "",
        }) as any[][];

        const transactions: TransactionRow[] = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0] && !row[3]) continue;

          const particulars = row[3] ? String(row[3]).trim() : "";
          const partLower   = particulars.toLowerCase();

          // Skip header rows
          if (partLower === "particulars" || partLower === "description") continue;

          const isOpening = partLower.includes("opening balance") ||
                            partLower.includes("brought forward") ||
                            partLower.includes("balance b/f");
          const isClosing = partLower.includes("closing balance") ||
                            partLower.includes("carried forward") ||
                            partLower.includes("balance c/f");

          transactions.push({
            date:             formatDate(row[0]),
            valueDate:        formatDate(row[1]),
            instNo:           row[2] ? String(row[2]).trim() : "",
            particulars,
            debit:            row[4] ? cleanNumber(row[4]) : "",
            credit:           row[5] ? cleanNumber(row[5]) : "",
            balance:          row[6] ? cleanNumber(row[6]) : "",
            isOpeningBalance: isOpening,
            isClosingBalance: isClosing,
          });
        }

        resolve(transactions);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};
