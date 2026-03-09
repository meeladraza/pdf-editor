import { MCBAccountInfo } from '../types';

interface Props {
  accountInfo: MCBAccountInfo;
  onChange: (info: MCBAccountInfo) => void;
}

export const McbAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const handleChange = (field: keyof MCBAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const input = (label: string, field: keyof MCBAccountInfo, placeholder?: string, span2?: boolean) => (
    <div className={span2 ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={accountInfo[field] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">MCB Bank Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input("Statement Date & Time", "statementDateTime", "Mar 06, 2026 09:49:50 AM")}
        {input("Branch Info",           "branchInfo",        "0018-KARACHI BUNDER ROAD")}
        {input("Account Title",         "accountTitle",      "SKF COLLECTION", true)}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address (with phone)</label>
          <textarea
            value={accountInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            placeholder={"PLOT # 16/1 SECTOR 12/D  NORTH KARACHI\nINDUSTRIAL AREA  \\KARACHI  0311-8266060"}
            rows={2}
          />
        </div>

        {input("Account No",          "accountNo",       "0751397851001165")}
        {input("IBAN",                "iban",            "PK10MUCB0751397851001165")}
        {input("Account Type",        "accountType",     "BUS")}
        {input("Currency",            "currency",        "PKR")}
        {input("Date of Account Open","accountOpenDate", "28-JAN-15")}
        {input("From Date",           "fromDate",        "05-MAR-26")}
        {input("To Date",             "toDate",          "05-MAR-26")}
        {input("Opening Balance",     "openingBalance",  "1,717,177.70", true)}
      </div>
    </div>
  );
};
