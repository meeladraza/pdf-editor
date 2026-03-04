import { BankAlFalahAccountInfo } from "../types";

interface Props {
  accountInfo: BankAlFalahAccountInfo;
  onChange: (info: BankAlFalahAccountInfo) => void;
}

export const BankAlFalahAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const handleChange = (field: keyof BankAlFalahAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Bank AlFalah Account Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>Print Date & Time</label>
          <input
            type="text"
            value={accountInfo.printDateTime}
            onChange={(e) => handleChange("printDateTime", e.target.value)}
            className={inputClass}
            placeholder="10/22/25, 3:53 PM"
          />
        </div>

        <div>
          <label className={labelClass}>Statement Text (Header Right)</label>
          <input
            type="text"
            value={accountInfo.stmtText}
            onChange={(e) => handleChange("stmtText", e.target.value)}
            className={inputClass}
            placeholder="STMT.ENT.BOOK.3.BR"
          />
        </div>

        <div>
          <label className={labelClass}>Opening Balance</label>
          <input
            type="text"
            value={accountInfo.openingBalance}
            onChange={(e) => handleChange("openingBalance", e.target.value)}
            className={inputClass}
            placeholder="315.44"
          />
        </div>

        <div>
          <label className={labelClass}>Account No</label>
          <input
            type="text"
            value={accountInfo.accountNo}
            onChange={(e) => handleChange("accountNo", e.target.value)}
            className={inputClass}
            placeholder="1009345774"
          />
        </div>

        <div>
          <label className={labelClass}>Account IBAN</label>
          <input
            type="text"
            value={accountInfo.iban}
            onChange={(e) => handleChange("iban", e.target.value)}
            className={inputClass}
            placeholder="PK0010001"
          />
        </div>

        <div>
          <label className={labelClass}>Booking Date Filter Value</label>
          <input
            type="text"
            value={accountInfo.bookingDate}
            onChange={(e) => handleChange("bookingDate", e.target.value)}
            className={inputClass}
            placeholder="20"
          />
        </div>

      </div>
    </div>
  );
};
