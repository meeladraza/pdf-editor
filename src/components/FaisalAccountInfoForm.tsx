import { FaisalAccountInfo } from '../types';

interface FaisalAccountInfoFormProps {
  accountInfo: FaisalAccountInfo;
  onChange: (info: FaisalAccountInfo) => void;
}

export const FaisalAccountInfoForm = ({ accountInfo, onChange }: FaisalAccountInfoFormProps) => {
  const handleChange = (field: keyof FaisalAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Faisal Bank Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account No</label>
          <input
            type="text"
            value={accountInfo.accountNo}
            onChange={(e) => handleChange('accountNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0134007000004420"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title Of Account</label>
          <input
            type="text"
            value={accountInfo.accountTitle}
            onChange={(e) => handleChange('accountTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A R INDUSTRIES"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            value={accountInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PLOT NO.L-18 BLOCK NO.22 F.B AREA KARACHI"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
          <input
            type="text"
            value={accountInfo.phoneNo}
            onChange={(e) => handleChange('phoneNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="03219216849"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Type</label>
          <input
            type="text"
            value={accountInfo.depositType}
            onChange={(e) => handleChange('depositType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CURRENT"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <input
            type="text"
            value={accountInfo.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PKR"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statement Period From</label>
          <input
            type="text"
            value={accountInfo.statementPeriodFrom}
            onChange={(e) => handleChange('statementPeriodFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="20-10-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statement Period To</label>
          <input
            type="text"
            value={accountInfo.statementPeriodTo}
            onChange={(e) => handleChange('statementPeriodTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="20-10-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statement Date</label>
          <input
            type="text"
            value={accountInfo.statementDate}
            onChange={(e) => handleChange('statementDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="22-10-2025 13:40:49"
          />
        </div>
      </div>
    </div>
  );
};
