import { Upload } from 'lucide-react';
import { TransactionRow } from '../types';
import { parseExcelFile } from '../utils/excelParser';

interface FileUploadProps {
  onDataLoaded: (transactions: TransactionRow[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const transactions = await parseExcelFile(file);
      onDataLoaded(transactions);
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
          <Upload className="w-10 h-10 mb-3 text-gray-400" />
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
