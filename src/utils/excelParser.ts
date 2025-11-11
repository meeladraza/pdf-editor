import * as XLSX from 'xlsx';
import { TransactionRow } from '../types';

export const parseExcelFile = (file: File): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true }); // Add cellDates option
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Use raw: false to get formatted values instead of raw Excel values
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          raw: false, // This will give you formatted dates as strings
          defval: ''
        }) as any[][];

        const transactions: TransactionRow[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0]) continue;

          const transaction: TransactionRow = {
            date: formatDate(row[0]), // Use the formatDate function
            particulars: row[1] ? String(row[1]) : '',
            instNo: row[2] ? String(row[2]) : '',
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

// Function to format date in "02-OCT-2025" format
export const formatDate = (dateValue: any): string => {
  if (!dateValue) return '';
  
  let date: Date;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    date = dateValue;
  } 
  // If it's an Excel date number (like 45943)
  else if (typeof dateValue === 'number') {
    // Excel date numbers are days since January 1, 1900
    date = new Date((dateValue - 25569) * 86400 * 1000); // 25569 = days from 1900-01-01 to 1970-01-01
  }
  // If it's already a string in some date format
  else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  }
  // Fallback
  else {
    return String(dateValue);
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return String(dateValue);
  }
  
  // Format as "02-OCT-2025"
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

export const formatNumber = (value: string | number): string => {
  if (!value) return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};