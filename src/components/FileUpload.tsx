// import { Upload } from 'lucide-react';
import { TransactionRow, FaisalTransactionRow, BankType } from '../types';
import { parseExcelFile } from '../utils/excelParser';
import { parseFaisalExcelFile } from '../utils/faisalExcelParser';
import { parseMeezanExcelFile } from '../utils/meezanExcelParser';
import { parseMetroExcelFile } from '../utils/metroExcelParser';
import { parseSonehriExcelFile } from '../utils/sonehriExcelParser';
import { parseDubaiExcelFile } from '../utils/dubaiExcelParser';
import { parseMcbIslamicExcelFile } from '../utils/mcbIslamicExcelParser';

interface FileUploadProps {
  onDataLoaded: (transactions: TransactionRow[] | FaisalTransactionRow[]) => void;
  bankType: BankType;
}

export const FileUpload = ({ onDataLoaded, bankType }: FileUploadProps) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (bankType === 'ubl') {
        const transactions = await parseExcelFile(file);
        onDataLoaded(transactions);
      } else if (bankType === 'faisal') {
        const transactions = await parseFaisalExcelFile(file);
        onDataLoaded(transactions);
      } else if (bankType === 'meezan') {
        const transactions = await parseMeezanExcelFile(file);
        onDataLoaded(transactions);
      } else if (bankType === 'metro') {
        const transactions = await parseMetroExcelFile(file);
        onDataLoaded(transactions);
      } else if (bankType === 'sonehri') {
        const transactions = await parseSonehriExcelFile(file);
        onDataLoaded(transactions);
      } else if (bankType === 'dubai') {
        const transactions = await parseDubaiExcelFile(file);
        onDataLoaded(transactions);
      } else if (bankType === 'mcb') {
        const transactions = await parseMcbIslamicExcelFile(file);
        onDataLoaded(transactions);
      }
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('Failed to parse Excel file. Please check the file format.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {/* <Upload className="w-10 h-10 mb-3 text-gray-400" /> */}
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Excel file (.xlsx, .xls)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
