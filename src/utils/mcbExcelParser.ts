import * as XLSX from "xlsx";
import { TransactionRow } from "../types";

// Excel columns:
// 0: DATE (Tran. Date)   1: CHQ NO# (Chq/Ref No)   2: TRANSACTION DETAIL
// 3: DEBIT               4: CREDIT                  5: BALANCE

const formatDate = (val: any): string => {
  if (!val) return "";
  const num = parseFloat(String(val));
  if (!isNaN(num) && num > 10000 && num < 70000) {
    const d = new Date((num - 25569) * 86400 * 1000);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return `${day}-${months[d.getUTCMonth()]}-${String(d.getUTCFullYear()).slice(-2)}`;
  }
  if (val instanceof Date) {
    const day = String(val.getDate()).padStart(2, "0");
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return `${day}-${months[val.getMonth()]}-${String(val.getFullYear()).slice(-2)}`;
  }
  return String(val).trim();
};

const cleanNumber = (val: any): string => {
  if (!val && val !== 0) return "";
  const s = String(val).replace(/,/g, "").trim();
  const n = parseFloat(s);
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const isDateLike = (val: any): boolean => {
  if (!val) return false;
  const num = parseFloat(String(val));
  if (!isNaN(num) && num > 10000 && num < 70000) return true;
  if (val instanceof Date) return true;
  const s = String(val).trim();
  if (/^\d{1,2}[\/\-][A-Za-z]{3}[\/\-]\d{2,4}/i.test(s)) return true;
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s)) return true;
  return false;
};

export const parseMCBExcelFile = (file: File): Promise<TransactionRow[]> => {
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
          // col 0 must look like a date
          if (!isDateLike(row[0])) continue;
          // col 5 must have a balance
          const balance = cleanNumber(row[5]);
          if (!balance) continue;

          transactions.push({
            date:         formatDate(row[0]),
            instNo:       String(row[1] || "").trim(),   // CHQ NO#
            particulars:  String(row[2] || "").trim(),   // TRANSACTION DETAIL
            debit:        cleanNumber(row[3]),            // DEBIT
            credit:       cleanNumber(row[4]),            // CREDIT
            balance,                                      // BALANCE
            // columns not in Excel → empty
            valueDate:    "",
            tranBranch:   "",
            narrative:    "",
            extReference: "",
            docNo:        "",
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
