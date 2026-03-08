import { BankIslamiAccountInfo } from '../types';

interface Props {
  accountInfo: BankIslamiAccountInfo;
  onChange: (info: BankIslamiAccountInfo) => void;
}

export const BankIslamiAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const handleChange = (field: keyof BankIslamiAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const input = (label: string, field: keyof BankIslamiAccountInfo, placeholder?: string, span2?: boolean) => (
    <div className={span2 ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={accountInfo[field] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Bank Islami Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input("Issuing Branch",   "issuingBranch",  "COCHINWALA MARKET")}
        {input("Issue Date",       "issueDate",       "04-Mar-2026")}
        {input("Account Name",     "accountName",     "SKF COLLECTION")}
        {input("Account Branch",   "accountBranch",   "COCHINWALA MARKET")}
        {input("Address Line 1",   "address1",        "plot no 16/1,")}
        {input("Address Line 2",   "address2",        "sector 12 -d,")}
        {input("Address Line 3",   "address3",        "north karachi industrial area karachi")}
        {input("City",             "city",            "KARACHI")}
        {input("Phone 1",          "phone1",          "03118266060")}
        {input("Phone 2",          "phone2",          "03118266060")}
        {input("Account Type",     "accountType",     "Current Account")}
        {input("Currency",         "currency",        "Pakistani Rupee")}
        {input("Account No",       "accountNo",       "101200053710001")}
        {input("IBAN",             "iban",            "PK83BKIP010120053710001")}
        {input("From Date",        "fromDate",        "25-Feb-2026")}
        {input("To Date",          "toDate",          "04-Mar-2026")}
        {input("Opening Balance",  "openingBalance",  "PKR 1,970,265.83", true)}
        {input("Printed By",       "printedBy",       "FW9806 on 3/4/2026 2:02 PM", true)}

        <div className="md:col-span-2 border-t pt-4 mt-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Summary (Last Page)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {input("Debit Transactions Count",  "debitCount",       "06")}
            {input("Total Debit Amount",        "totalDebit",       "4,702,320.00")}
            {input("Credit Transactions Count", "creditCount",      "15")}
            {input("Total Credit Amount",       "totalCredit",      "2,966,600.00")}
            {input("Closing Date",              "closingDate",      "04-Mar-2026")}
            {input("Closing Balance",           "closingBalance",   "234,545.83")}
            {input("Available Balance",         "availableBalance", "234,545.83")}
          </div>
        </div>
      </div>
    </div>
  );
};
