import { AccountInfo } from '../types';

interface AccountInfoFormProps {
  accountInfo: AccountInfo;
  onChange: (info: AccountInfo) => void;
}

export const AccountInfoForm = ({ accountInfo, onChange }: AccountInfoFormProps) => {
  const handleChange = (field: keyof AccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
          <input
            type="text"
            value={accountInfo.branchCode}
            onChange={(e) => handleChange('branchCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0004-AMEEN SALEH MUHAMMAD ST. KHI"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
          <input
            type="text"
            value={accountInfo.accountTitle}
            onChange={(e) => handleChange('accountTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="AR INDUSTRIES"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input
            type="text"
            value={accountInfo.address1}
            onChange={(e) => handleChange('address1', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PLOT NO L-18 BLOCK NO 22"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={accountInfo.address2}
            onChange={(e) => handleChange('address2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="F. B AREA KARACHI KARACHI"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3</label>
          <input
            type="text"
            value={accountInfo.address3}
            onChange={(e) => handleChange('address3', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="KARACHI"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registered Cell No</label>
          <input
            type="text"
            value={accountInfo.regCellNo}
            onChange={(e) => handleChange('regCellNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="03219216849"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IBAN No</label>
          <input
            type="text"
            value={accountInfo.ibanNo}
            onChange={(e) => handleChange('ibanNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PK55 UNIL 0109 0003 0116 5884"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CIF No</label>
          <input
            type="text"
            value={accountInfo.cifNo}
            onChange={(e) => handleChange('cifNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="22249075"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statement Period</label>
          <input
            type="text"
            value={accountInfo.statementPeriod}
            onChange={(e) => handleChange('statementPeriod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From 01-OCT-2025 To 13-OCT-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account No</label>
          <input
            type="text"
            value={accountInfo.accountNo}
            onChange={(e) => handleChange('accountNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="000498400782"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
          <input
            type="text"
            value={accountInfo.accountType}
            onChange={(e) => handleChange('accountType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="SAVING"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
          <input
            type="text"
            value={accountInfo.productType}
            onChange={(e) => handleChange('productType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="AMEEN BUSINESS ACCOUNT (ABA)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <input
            type="text"
            value={accountInfo.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PAKISTANI RUPEE"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
          <input
            type="text"
            value={accountInfo.balance}
            onChange={(e) => handleChange('balance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3,207,779.56 Cr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
          <input
            type="text"
            value={accountInfo.asOf}
            onChange={(e) => handleChange('asOf', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="13-OCT-2025"
          />
        </div>
      </div>
    </div>
  );
};
