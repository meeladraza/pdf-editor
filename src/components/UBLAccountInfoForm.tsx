import { UBLAccountInfo } from '../types';

interface UBLAccountInfoFormProps {
  accountInfo: UBLAccountInfo;
  onChange: (info: UBLAccountInfo) => void;
}

export const UBLAccountInfoForm = ({ accountInfo, onChange }: UBLAccountInfoFormProps) => {
  const handleChange = (field: keyof UBLAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">UBL Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
          <input
            type="text"
            value={accountInfo.branchCode}
            onChange={(e) => handleChange('branchCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
          <input
            type="text"
            value={accountInfo.accountTitle}
            onChange={(e) => handleChange('accountTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input
            type="text"
            value={accountInfo.address1}
            onChange={(e) => handleChange('address1', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={accountInfo.address2}
            onChange={(e) => handleChange('address2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3</label>
          <input
            type="text"
            value={accountInfo.address3}
            onChange={(e) => handleChange('address3', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registered Cell No</label>
          <input
            type="text"
            value={accountInfo.regCellNo}
            onChange={(e) => handleChange('regCellNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IBAN No</label>
          <input
            type="text"
            value={accountInfo.ibanNo}
            onChange={(e) => handleChange('ibanNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CIF No</label>
          <input
            type="text"
            value={accountInfo.cifNo}
            onChange={(e) => handleChange('cifNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statement Period</label>
          <input
            type="text"
            value={accountInfo.statementPeriod}
            onChange={(e) => handleChange('statementPeriod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account No</label>
          <input
            type="text"
            value={accountInfo.accountNo}
            onChange={(e) => handleChange('accountNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
          <input
            type="text"
            value={accountInfo.accountType}
            onChange={(e) => handleChange('accountType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
          <input
            type="text"
            value={accountInfo.productType}
            onChange={(e) => handleChange('productType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <input
            type="text"
            value={accountInfo.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
          <input
            type="text"
            value={accountInfo.balance}
            onChange={(e) => handleChange('balance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
          <input
            type="text"
            value={accountInfo.asOf}
            onChange={(e) => handleChange('asOf', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
