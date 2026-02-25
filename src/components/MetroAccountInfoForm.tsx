import { MetroAccountInfo } from '../types';

interface MetroAccountInfoFormProps {
  accountInfo: MetroAccountInfo;
  onChange: (info: MetroAccountInfo) => void;
}

export const MetroAccountInfoForm = ({ accountInfo, onChange }: MetroAccountInfoFormProps) => {
  const handleChange = (field: keyof MetroAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Habib Metro Bank Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
          <input
            type="text"
            value={accountInfo.accountTitle}
            onChange={(e) => handleChange('accountTitle', e.target.value)}
            className={inputClass}
            placeholder="S.K.F. COLLECTION"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={accountInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={inputClass}
            rows={3}
            placeholder={"SHOP# 124-125 1ST FLOOR TEXTILE PLAZA\nNEAR NEW MEMON MASJID MA JINNAH\nROAD, Karachi, Pakistan"}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
          <input
            type="text"
            value={accountInfo.branchName}
            onChange={(e) => handleChange('branchName', e.target.value)}
            className={inputClass}
            placeholder="Textile Plaza Branch"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">A/C Type</label>
          <input
            type="text"
            value={accountInfo.acType}
            onChange={(e) => handleChange('acType', e.target.value)}
            className={inputClass}
            placeholder="Demand Deposits"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">A/C Number</label>
          <input
            type="text"
            value={accountInfo.acNumber}
            onChange={(e) => handleChange('acNumber', e.target.value)}
            className={inputClass}
            placeholder="6-1-42-20311-714-140781"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
          <input
            type="text"
            value={accountInfo.iban}
            onChange={(e) => handleChange('iban', e.target.value)}
            className={inputClass}
            placeholder="PK61MPBL0142027140781"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <input
            type="text"
            value={accountInfo.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className={inputClass}
            placeholder="PKR"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="text"
            value={accountInfo.from}
            onChange={(e) => handleChange('from', e.target.value)}
            className={inputClass}
            placeholder="01-Jul-2020"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="text"
            value={accountInfo.to}
            onChange={(e) => handleChange('to', e.target.value)}
            className={inputClass}
            placeholder="30-Jun-2021"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Printed On</label>
          <input
            type="text"
            value={accountInfo.printedOn}
            onChange={(e) => handleChange('printedOn', e.target.value)}
            className={inputClass}
            placeholder="27-Sep-2021"
          />
        </div>
      </div>
    </div>
  );
};
