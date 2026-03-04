import * as XLSX from 'xlsx';
import { TransactionRow } from '../types';
import { formatDate } from './formatDate';

// ── Doc No extraction from Particulars ────────────────────────────────────────
// Priority order:
//   1. PO identifier  e.g. "Instrument Issuance. PO.0110.4478589 …"   → PO.0110.4478589
//   2. STAN number    e.g. "… STAN (783639)"                          → 783639
//   3. CR number      e.g. "Transfer Online CR 66096331 (REF# …)"     → 66096331
//   4. Otherwise      e.g. "Outward Clearing Cheque (REF# 478156)"    → ""
const extractDocNo = (particulars: string): string => {
  if (!particulars) return '';

  // 1. PO. identifier (non-whitespace chars after "PO.")
  const poMatch = particulars.match(/\bPO\.\S+/i);
  if (poMatch) return poMatch[0];

  // 2. STAN (number)
  const stanMatch = particulars.match(/\bSTAN\s*\((\d+)\)/i);
  if (stanMatch) return stanMatch[1];

  // 3. CR followed by digits
  const crMatch = particulars.match(/\bCR\s+(\d+)/);
  if (crMatch) return crMatch[1];

  return '';
};

export const parseMeezanExcelFile = (
  file: File
): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: '',
        }) as any[][];

        const transactions: TransactionRow[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0]) continue;

          // Columns: Date | Value Date | Particulars | Debit | Credit | Balance
          const particularsRaw = row[2] ? String(row[2]) : '';
          const transaction: TransactionRow = {
            date: formatDate(row[0]),
            valueDate: formatDate(row[1]),
            docNo: extractDocNo(particularsRaw),
            particulars: particularsRaw,
            debit: row[3] ? String(row[3]) : '',
            credit: row[4] ? String(row[4]) : '',
            balance: row[5] ? String(row[5]) : '',
          };

          const particularsLower = transaction.particulars.toLowerCase();
          if (particularsLower.includes('opening balance')) {
            transaction.isOpeningBalance = true;
          }
          if (particularsLower.includes('closing balance')) {
            transaction.isClosingBalance = true;
          }

          transactions.push(transaction);
        }

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

export const formatNumber = (value: string | number): string => {
  if (!value) return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
