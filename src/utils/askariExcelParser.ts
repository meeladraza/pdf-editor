import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// Excel columns: DATE(0) | INS#(1) | DESCRIPTION(2) | DEBIT(3) | CREDIT(4) | BALANCE(5)
// PDF columns:  DATE     | PARTICULARS               | INS #/Time  | VAL DATE  | AMOUNT   | BALANCE
// VAL DATE = same as DATE (no separate val date column in Excel)

const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const toDisplayDate = (d: number, m: number, y: number): string =>
  `${String(d).padStart(2, "0")}-${MON[m]}-${y}`;

const formatDate = (val: any): string => {
  if (!val) return "";
  const s = String(val).trim();
  if (!s) return "";

  // Numeric Excel serial
  if (typeof val === "number" && val > 25568) {
    const date = new Date(new Date(1899, 11, 30).getTime() + val * 86400 * 1000);
    if (!isNaN(date.getTime()))
      return toDisplayDate(date.getDate(), date.getMonth(), date.getFullYear());
  }

  // Already formatted (e.g. "01-SEP-25")
  if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/.test(s)) return s;

  // DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const m = parseInt(dmy[2]) - 1;
    if (m >= 0 && m <= 11) return toDisplayDate(parseInt(dmy[1]), m, parseInt(dmy[3]));
  }

  // YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const m = parseInt(iso[2]) - 1;
    if (m >= 0 && m <= 11) return toDisplayDate(parseInt(iso[3]), m, parseInt(iso[1]));
  }

  return s;
};

const fmt2dec = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Parse a positive amount column (separate credit or debit column)
const parsePositive = (val: any): string => {
  if (!val && val !== 0) return "";
  const n = parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(n) || n <= 0) return "";
  return fmt2dec(n);
};

const cleanBalance = (val: any): string => {
  if (!val && val !== 0) return "";
  const s = String(val).trim().replace(/,/g, "");
  const n = Math.abs(parseFloat(s));
  if (isNaN(n)) return "";
  return fmt2dec(n);
};

export const parseAskariExcelFile = (file: File): Promise<TransactionRow[]> => {
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
          const row  = jsonData[i];
          const desc = row[2] ? String(row[2]).trim() : "";

          // Skip fully empty rows
          if (!row[0] && !desc && !row[3] && !row[4] && !row[5]) continue;

          // Skip column header rows
          const descLower = desc.toLowerCase();
          if (descLower === "particulars" || descLower === "description") continue;

          // Skip pure TOTAL rows
          if (descLower === "total") continue;

          const debit  = parsePositive(row[3]);
          const credit = parsePositive(row[4]);
          const txDate = formatDate(row[0]);

          const isOpening = descLower.includes("opening balance");
          const isClosing = descLower.includes("closing balance");

          transactions.push({
            date:             txDate,
            particulars:      desc,
            instNo:           row[1] ? String(row[1]).trim() : "",
            valueDate:        txDate,   // same as date — no separate val date column
            credit,
            debit,
            balance:          cleanBalance(row[5]),
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
