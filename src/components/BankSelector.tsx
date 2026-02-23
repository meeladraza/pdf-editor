import { BankType } from '../types';
// import { Building2 } from 'lucide-react';

interface BankSelectorProps {
  selectedBank: BankType;
  onBankChange: (bank: BankType) => void;
}

export const BankSelector = ({ selectedBank, onBankChange }: BankSelectorProps) => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        {/* <Building2 className="w-5 h-5 text-gray-700" /> */}
        <h2 className="text-lg font-semibold text-gray-800">Select Bank Template</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onBankChange('ubl')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedBank === 'ubl'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="font-semibold">UBL Bank</div>
          <div className="text-xs mt-1 opacity-75">United Bank Limited</div>
        </button>
        <button
          onClick={() => onBankChange('faisal')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedBank === 'faisal'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="font-semibold">Faisal Bank</div>
          <div className="text-xs mt-1 opacity-75">Faysal Bank Limited</div>
        </button>
      </div>
    </div>
  );
};
