import { JSBankAccountInfo } from "../types";

interface Props {
  accountInfo: JSBankAccountInfo;
  onChange: (info: JSBankAccountInfo) => void;
}

export const JsBankAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const handleChange = (field: keyof JSBankAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        JS Bank Account Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>Statement Date (header)</label>
          <input type="text" value={accountInfo.statementDate} onChange={(e) => handleChange("statementDate", e.target.value)} className={inputClass} placeholder="22 October 2025" />
        </div>
        <div>
          <label className={labelClass}>Statement Time (header)</label>
          <input type="text" value={accountInfo.statementTime} onChange={(e) => handleChange("statementTime", e.target.value)} className={inputClass} placeholder="15:10:14" />
        </div>

        <div>
          <label className={labelClass}>Account Name</label>
          <input type="text" value={accountInfo.accountName} onChange={(e) => handleChange("accountName", e.target.value)} className={inputClass} placeholder="A R INDUSTRIES" />
        </div>
        <div>
          <label className={labelClass}>ATTN Name</label>
          <input type="text" value={accountInfo.attnName} onChange={(e) => handleChange("attnName", e.target.value)} className={inputClass} placeholder="MUHAMMAD AQEEL PINGER" />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Address Line 1</label>
          <input type="text" value={accountInfo.address1} onChange={(e) => handleChange("address1", e.target.value)} className={inputClass} placeholder="PLOT NO F 73 SITE SUPER HIGWAY" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Address Line 2</label>
          <input type="text" value={accountInfo.address2} onChange={(e) => handleChange("address2", e.target.value)} className={inputClass} placeholder="PHASE 2 MALIR GADAP TOWN KARACHI" />
        </div>

        <div>
          <label className={labelClass}>Account No</label>
          <input type="text" value={accountInfo.accountNo} onChange={(e) => handleChange("accountNo", e.target.value)} className={inputClass} placeholder="0001477430" />
        </div>
        <div>
          <label className={labelClass}>Old Account No</label>
          <input type="text" value={accountInfo.oldAccountNo} onChange={(e) => handleChange("oldAccountNo", e.target.value)} className={inputClass} placeholder="PK64JSBL9519000001477430" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>IBAN No</label>
          <input type="text" value={accountInfo.ibanNo} onChange={(e) => handleChange("ibanNo", e.target.value)} className={inputClass} placeholder="PK64JSBL9519000001477430" />
        </div>

        <div>
          <label className={labelClass}>Account Type</label>
          <input type="text" value={accountInfo.accountType} onChange={(e) => handleChange("accountType", e.target.value)} className={inputClass} placeholder="1001-Current Accounts" />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input type="text" value={accountInfo.currency} onChange={(e) => handleChange("currency", e.target.value)} className={inputClass} placeholder="PKR" />
        </div>

        <div>
          <label className={labelClass}>Start Date</label>
          <input type="text" value={accountInfo.startDate} onChange={(e) => handleChange("startDate", e.target.value)} className={inputClass} placeholder="20 OCT 2025" />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input type="text" value={accountInfo.endDate} onChange={(e) => handleChange("endDate", e.target.value)} className={inputClass} placeholder="20 OCT 2025" />
        </div>

        <div>
          <label className={labelClass}>Joint Holders</label>
          <input type="text" value={accountInfo.jointHolders} onChange={(e) => handleChange("jointHolders", e.target.value)} className={inputClass} placeholder="NONE" />
        </div>
        <div>
          <label className={labelClass}>Statement Date Label</label>
          <input type="text" value={accountInfo.statementDateLabel} onChange={(e) => handleChange("statementDateLabel", e.target.value)} className={inputClass} placeholder="22 OCT 2025" />
        </div>

        <div>
          <label className={labelClass}>Opening Balance</label>
          <input type="text" value={accountInfo.openingBalance} onChange={(e) => handleChange("openingBalance", e.target.value)} className={inputClass} placeholder="443,796.68" />
        </div>
        <div>
          <label className={labelClass}>User</label>
          <input type="text" value={accountInfo.user} onChange={(e) => handleChange("user", e.target.value)} className={inputClass} placeholder="HIBAH.12494" />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Time Date (footer)</label>
          <input type="text" value={accountInfo.timeDate} onChange={(e) => handleChange("timeDate", e.target.value)} className={inputClass} placeholder="15:10:14 22 OCT 2025" />
        </div>

      </div>
    </div>
  );
};
