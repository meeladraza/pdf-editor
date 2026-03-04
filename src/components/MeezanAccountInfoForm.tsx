import { MeezanAccountInfo } from '../types';

interface MeezanAccountInfoFormProps {
  accountInfo: MeezanAccountInfo;
  onChange: (info: MeezanAccountInfo) => void;
}

export const MeezanAccountInfoForm = ({ accountInfo, onChange }: MeezanAccountInfoFormProps) => {
  const handleChange = (field: keyof MeezanAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Meezan Bank Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
          <input
            type="text"
            value={accountInfo.branchName}
            onChange={(e) => handleChange('branchName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MAIN BRANCH"
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={accountInfo.address2 || ''}
            onChange={(e) => handleChange('address2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="NADIR HOUSE I I CHUNDRIGAR ROAD KARACHI"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
          <input
            type="text"
            value={accountInfo.iban}
            onChange={(e) => handleChange('iban', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PK00 MEEZ 0000000000000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account No</label>
          <input
            type="text"
            value={accountInfo.accountNo}
            onChange={(e) => handleChange('accountNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0000000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Old Account No (optional)</label>
          <input
            type="text"
            value={accountInfo.oldAccountNo || ''}
            onChange={(e) => handleChange('oldAccountNo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0000000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <input
            type="text"
            value={accountInfo.product}
            onChange={(e) => handleChange('product', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="SAVINGS ACCOUNT"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="text"
            value={accountInfo.fromDate}
            onChange={(e) => handleChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="01-10-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="text"
            value={accountInfo.toDate}
            onChange={(e) => handleChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="31-10-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Print Date</label>
          <input
            type="text"
            value={accountInfo.printDate}
            onChange={(e) => handleChange('printDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="01-11-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
          <input
            type="text"
            value={accountInfo.openingBalance || ''}
            onChange={(e) => handleChange('openingBalance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12,642,549.36"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Generated By</label>
          <input
            type="text"
            value={accountInfo.generatedBy}
            onChange={(e) => handleChange('generatedBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="System"
          />
        </div>
      </div>
    </div>
  );
};
