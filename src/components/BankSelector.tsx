import { BankType } from '../types';

interface BankSelectorProps {
  selectedBank: BankType;
  onBankChange: (bank: BankType) => void;
}

const BANKS: { id: BankType; short: string; label: string }[] = [
  { id: 'ubl',     short: 'UBL',     label: 'United Bank' },
  { id: 'faisal',  short: 'FSL',     label: 'Faysal Bank' },
  { id: 'meezan',  short: 'MZN',     label: 'Meezan Bank' },
  { id: 'metro',   short: 'HMB',     label: 'Habib Metro' },
  { id: 'sonehri', short: 'SNB',     label: 'Sonehri Bank' },
  { id: 'dubai',   short: 'DIB',     label: 'Dubai Islamic' },
  { id: 'mcb',     short: 'MCB',     label: 'MCB Islamic' },
  { id: 'alhabib', short: 'ALH',     label: 'Bank AL Habib' },
  { id: 'alfalah', short: 'ALF',     label: 'Bank AlFalah' },
  { id: 'hbl',     short: 'HBL',     label: 'Habib Bank' },
  { id: 'bml',        short: 'BML', label: 'Bank Makramah' },
  { id: 'bankislami', short: 'BKI', label: 'Bank Islami' },
];

export const BankSelector = ({ selectedBank, onBankChange }: BankSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {BANKS.map((bank) => {
        const isActive = selectedBank === bank.id;
        return (
          <button
            key={bank.id}
            onClick={() => onBankChange(bank.id)}
            title={bank.label}
            className={`p-2 rounded-lg border text-left transition-all ${
              isActive
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <div className={`text-[11px] font-bold leading-tight ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
              {bank.short}
            </div>
            <div className={`text-[9px] mt-0.5 leading-tight ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
              {bank.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};
