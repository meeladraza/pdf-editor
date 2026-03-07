import { useState } from 'react';
import { Upload, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { TransactionRow, FaisalTransactionRow, BankType } from '../types';
import { parseExcelFile } from '../utils/excelParser';
import { parseFaisalExcelFile } from '../utils/faisalExcelParser';
import { parseMeezanExcelFile } from '../utils/meezanExcelParser';
import { parseMetroExcelFile } from '../utils/metroExcelParser';
import { parseSonehriExcelFile } from '../utils/sonehriExcelParser';
import { parseDubaiExcelFile } from '../utils/dubaiExcelParser';
import { parseMcbIslamicExcelFile } from '../utils/mcbIslamicExcelParser';
import { parseBankAlHabibExcelFile } from '../utils/bankAlHabibExcelParser';
import { parseBankAlFalahExcelFile } from '../utils/bankAlFalahExcelParser';
import { parseHBLExcelFile } from '../utils/hblExcelParser';
import { parseBMLExcelFile } from '../utils/bmlExcelParser';

interface FileUploadProps {
  onDataLoaded: (transactions: TransactionRow[] | FaisalTransactionRow[]) => void;
  bankType: BankType;
}

export const FileUpload = ({ onDataLoaded, bankType }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    setIsLoading(true);
    try {
      let transactions: TransactionRow[] | FaisalTransactionRow[];
      if (bankType === 'ubl')          transactions = await parseExcelFile(file);
      else if (bankType === 'faisal')  transactions = await parseFaisalExcelFile(file);
      else if (bankType === 'meezan')  transactions = await parseMeezanExcelFile(file);
      else if (bankType === 'metro')   transactions = await parseMetroExcelFile(file);
      else if (bankType === 'sonehri') transactions = await parseSonehriExcelFile(file);
      else if (bankType === 'dubai')   transactions = await parseDubaiExcelFile(file);
      else if (bankType === 'mcb')     transactions = await parseMcbIslamicExcelFile(file);
      else if (bankType === 'alhabib') transactions = await parseBankAlHabibExcelFile(file);
      else if (bankType === 'alfalah') transactions = await parseBankAlFalahExcelFile(file);
      else if (bankType === 'hbl')     transactions = await parseHBLExcelFile(file);
      else                             transactions = await parseBMLExcelFile(file);

      setUploadedFileName(file.name);
      onDataLoaded(transactions);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('Failed to parse Excel file. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none ${
        isLoading
          ? 'border-blue-300 bg-blue-50 cursor-wait'
          : isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md'
            : uploadedFileName
              ? 'border-green-400 bg-green-50 hover:bg-green-100'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60'
      }`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-blue-600 font-medium">Parsing file…</span>
        </div>
      ) : uploadedFileName ? (
        <div className="flex flex-col items-center gap-1 px-3 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <span className="text-xs text-green-700 font-semibold truncate max-w-[210px]">{uploadedFileName}</span>
          <span className="text-[10px] text-green-500">Click to replace</span>
        </div>
      ) : isDragging ? (
        <div className="flex flex-col items-center gap-1">
          <FileSpreadsheet className="w-7 h-7 text-blue-500" />
          <span className="text-xs text-blue-600 font-semibold">Drop to upload</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <Upload className="w-6 h-6 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">Drop file or <span className="text-blue-600 underline">browse</span></span>
          <span className="text-[10px] text-slate-400">.xlsx · .xls</span>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
    </label>
  );
};
