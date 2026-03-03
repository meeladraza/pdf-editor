import { BankAlHabibAccountInfo } from "../types";

interface Props {
  accountInfo: BankAlHabibAccountInfo;
  onChange: (info: BankAlHabibAccountInfo) => void;
}

export const BankAlHabibAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const handleChange = (field: keyof BankAlHabibAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Bank AL Habib Account Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>Print Date</label>
          <input type="text" value={accountInfo.printDate} onChange={(e) => handleChange("printDate", e.target.value)} className={inputClass} placeholder="22/10/2025" />
        </div>
        <div>
          <label className={labelClass}>Branch Code</label>
          <input type="text" value={accountInfo.branchCode} onChange={(e) => handleChange("branchCode", e.target.value)} className={inputClass} placeholder="1011" />
        </div>
        <div>
          <label className={labelClass}>Branch Name</label>
          <input type="text" value={accountInfo.branchName} onChange={(e) => handleChange("branchName", e.target.value)} className={inputClass} placeholder="CLOTH MARKET BRANCH - 1011" />
        </div>
        <div>
          <label className={labelClass}>Branch Address</label>
          <input type="text" value={accountInfo.branchAddress} onChange={(e) => handleChange("branchAddress", e.target.value)} className={inputClass} placeholder="NEW NEHAM ROAD, KARACHI, PAKISTAN" />
        </div>
        <div>
          <label className={labelClass}>From Date</label>
          <input type="text" value={accountInfo.fromDate} onChange={(e) => handleChange("fromDate", e.target.value)} className={inputClass} placeholder="20/10/2025" />
        </div>
        <div>
          <label className={labelClass}>To Date</label>
          <input type="text" value={accountInfo.toDate} onChange={(e) => handleChange("toDate", e.target.value)} className={inputClass} placeholder="20/10/2025" />
        </div>
        <div>
          <label className={labelClass}>Account Name</label>
          <input type="text" value={accountInfo.accountName} onChange={(e) => handleChange("accountName", e.target.value)} className={inputClass} placeholder="A R INDUSTRIES" />
        </div>
        <div>
          <label className={labelClass}>Account No</label>
          <input type="text" value={accountInfo.accountNo} onChange={(e) => handleChange("accountNo", e.target.value)} className={inputClass} placeholder="1011-0981-XXXXXX-01-4" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Address Line 1</label>
          <input type="text" value={accountInfo.address1} onChange={(e) => handleChange("address1", e.target.value)} className={inputClass} placeholder="PLT NO L-18 BLK # 22 FB AREA" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Address Line 2</label>
          <input type="text" value={accountInfo.address2} onChange={(e) => handleChange("address2", e.target.value)} className={inputClass} placeholder="." />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Address Line 3</label>
          <input type="text" value={accountInfo.address3} onChange={(e) => handleChange("address3", e.target.value)} className={inputClass} placeholder="KARACHI - PAKISTAN" />
        </div>
        <div>
          <label className={labelClass}>Account Type</label>
          <input type="text" value={accountInfo.accountType} onChange={(e) => handleChange("accountType", e.target.value)} className={inputClass} placeholder="AL HABIB CURNT PLUS" />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input type="text" value={accountInfo.currency} onChange={(e) => handleChange("currency", e.target.value)} className={inputClass} placeholder="PAKISTANI RUPEES" />
        </div>
        <div>
          <label className={labelClass}>QR Code Text</label>
          <input type="text" value={accountInfo.qrText} onChange={(e) => handleChange("qrText", e.target.value)} className={inputClass} placeholder="1011-0981-XXXXXX-01-4" />
        </div>
        <div>
          <label className={labelClass}>QR Sub Text</label>
          <input type="text" value={accountInfo.qrSubText} onChange={(e) => handleChange("qrSubText", e.target.value)} className={inputClass} placeholder="A R INDUSTRIES - 8701" />
        </div>

      </div>
    </div>
  );
};
