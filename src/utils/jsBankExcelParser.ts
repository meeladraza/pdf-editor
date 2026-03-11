import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// JS Bank columns: Post Date | Description | Cheque/Inst # | Value Date | Debit Amount | Credit Amount | Balance | Reference

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

  // Already DD-Mon-YYYY
  if (/^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(s)) return s;

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

const cleanNumber = (val: any): string => {
  if (!val && val !== 0) return "";
  const s = String(val).trim().replace(/,/g, "");
  if (!s || isNaN(Number(s))) return "";
  return Number(s).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseJsBankExcelFile = (file: File): Promise<TransactionRow[]> => {
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
          const desc = row[1] ? String(row[1]).trim() : "";
          const inst ="";

          // Skip fully empty rows
          if (!row[0] && !desc && !row[2] && !row[3] && !row[4]) continue;

          // Skip column header row
          if (desc.toLowerCase() === "description") continue;

          // Skip TOTAL row (inst column contains "TOTAL")
          if (inst.toUpperCase().includes("TOTAL")) continue;

          const descLower = desc.toLowerCase();
          const isOpening = descLower.includes("RIES FOR PERIOD") || descLower.includes("brought forward");
          const isClosing = descLower.includes("CLOSING BALANCE") || descLower.includes("closing bal");

          transactions.push({
            date:             formatDate(row[0]),
            particulars:      desc,
            instNo:           inst,
            valueDate:        "",
            debit:            cleanNumber(row[2]),
            credit:           cleanNumber(row[3]),
            balance:          cleanNumber(row[4]),
            extReference:     "",
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
