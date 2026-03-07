import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// BML columns: Date | Value Date | Particulars | Instrument | Debit | Credit | Day-end Balance

const formatDate = (val: any): string => {
  if (!val) return "";
  const s = String(val).trim();
  if (!s) return "";
  if (typeof val === "number" && val > 25568) {
    const epoch = new Date(1899, 11, 30);
    const date  = new Date(epoch.getTime() + val * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      const d   = date.getDate().toString().padStart(2, "0");
      const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${d}-${mon[date.getMonth()]}-${date.getFullYear()}`;
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

export const parseBMLExcelFile = (file: File): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data     = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: false });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1, raw: true, defval: "",
        }) as any[][];

        const transactions: TransactionRow[] = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0] && !row[2] && !row[3] && !row[4] && !row[5]) continue;

          const particulars = row[2] ? String(row[2]).trim() : "";
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
            valueDate:        "",
            particulars,
            instNo:           row[3] ? String(row[1]).trim() : "",
            debit:            row[3] ? cleanNumber(row[3]) : "",
            credit:           row[4] ? cleanNumber(row[4]) : "",
            balance:          row[5] ? cleanNumber(row[5]) : "",
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
    reader.readAsBinaryString(file);
  });
};
