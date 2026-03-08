import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// BankIslami columns: Date | Description | Withdrawal | Deposit | Balance

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
      return `${d}/${mon[date.getMonth()]}/${date.getFullYear()}`;
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

export const parseBankIslamiExcelFile = (file: File): Promise<TransactionRow[]> => {
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
          if (!row[0] && !row[1] && !row[2] && !row[3] && !row[4]) continue;

          const description = row[1] ? String(row[1]).trim() : "";
          const descLower   = description.toLowerCase();

          // Skip header rows
          if (descLower === "description" || descLower === "particulars") continue;
          // Skip summary rows
          if (descLower.includes("debit transactions") || descLower.includes("credit transactions")) continue;
          if (descLower.includes("closing balance") || descLower.includes("available balance")) continue;
          if (descLower.includes("total debit") || descLower.includes("total credit")) continue;

          transactions.push({
            date:        formatDate(row[0]),
            particulars: description,
            debit:       row[2] ? cleanNumber(row[2]) : "",
            credit:      row[3] ? cleanNumber(row[3]) : "",
            balance:     row[4] ? cleanNumber(row[4]) : "",
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
