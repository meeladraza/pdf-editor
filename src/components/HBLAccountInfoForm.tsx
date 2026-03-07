import { HBLAccountInfo } from "../types";

interface Props {
  accountInfo: HBLAccountInfo;
  onChange: (info: HBLAccountInfo) => void;
}

export const HBLAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const handleChange = (field: keyof HBLAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">HBL Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>Branch Name</label>
          <input type="text" value={accountInfo.branchName}
            onChange={(e) => handleChange("branchName", e.target.value)}
            className={inputClass} placeholder="BAITUL HAMDM.A.JINNAH RD. KARACHI" />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input type="text" value={accountInfo.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className={inputClass} placeholder="24 Nov 2025" />
        </div>

        <div>
          <label className={labelClass}>Account Holder Name</label>
          <input type="text" value={accountInfo.accountHolderName}
            onChange={(e) => handleChange("accountHolderName", e.target.value)}
            className={inputClass} placeholder="RADIUM SILK FACTORY" />
        </div>

        <div>
          <label className={labelClass}>Account No.</label>
          <input type="text" value={accountInfo.accountNo}
            onChange={(e) => handleChange("accountNo", e.target.value)}
            className={inputClass} placeholder="0004*******61-03" />
        </div>

        <div>
          <label className={labelClass}>Address Line 1</label>
          <input type="text" value={accountInfo.address1}
            onChange={(e) => handleChange("address1", e.target.value)}
            className={inputClass} placeholder="PLOT NO.18/1/4 BLOCK NO.22" />
        </div>

        <div>
          <label className={labelClass}>Address Line 2</label>
          <input type="text" value={accountInfo.address2}
            onChange={(e) => handleChange("address2", e.target.value)}
            className={inputClass} placeholder="INDUSTRIAL AREA F.B.AREA" />
        </div>

        <div>
          <label className={labelClass}>Address Line 3</label>
          <input type="text" value={accountInfo.address3}
            onChange={(e) => handleChange("address3", e.target.value)}
            className={inputClass} placeholder="KARACHI" />
        </div>

        <div>
          <label className={labelClass}>Account Type</label>
          <input type="text" value={accountInfo.accountType}
            onChange={(e) => handleChange("accountType", e.target.value)}
            className={inputClass} placeholder="ISLAMIC CURRENT ACCOUNT" />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <input type="text" value={accountInfo.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            className={inputClass} placeholder="Pakistan Rupee" />
        </div>

        <div>
          <label className={labelClass}>IBAN</label>
          <input type="text" value={accountInfo.iban}
            onChange={(e) => handleChange("iban", e.target.value)}
            className={inputClass} placeholder="PK03 **** **** **** 6103" />
        </div>

      </div>
    </div>
  );
};
