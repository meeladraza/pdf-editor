import * as XLSX from 'xlsx';
import { TransactionRow } from '../types';
import { formatDate } from './formatDate';

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

          const transaction: TransactionRow = {
            date: formatDate(row[0]),
            valueDate: formatDate(row[1]),
            docNo: row[2] ? String(row[2]) : '',
            particulars: row[3] ? String(row[3]) : '',
            debit: row[4] ? String(row[4]) : '',
            credit: row[5] ? String(row[5]) : '',
            balance: row[6] ? String(row[6]) : '',
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
