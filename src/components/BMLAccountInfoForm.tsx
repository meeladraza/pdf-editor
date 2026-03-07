import { BMLAccountInfo } from '../types';

interface BMLAccountInfoFormProps {
  accountInfo: BMLAccountInfo;
  onChange: (info: BMLAccountInfo) => void;
}

export const BMLAccountInfoForm = ({ accountInfo, onChange }: BMLAccountInfoFormProps) => {
  const handleChange = (field: keyof BMLAccountInfo, value: string) => {
    onChange({ ...accountInfo, [field]: value });
  };

  const input = (label: string, field: keyof BMLAccountInfo, placeholder?: string, span2?: boolean) => (
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
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Bank Makramah (BML) Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input("Branch Name",    "branchName",    "II Chundrigar Road Br,Khi(IBB)")}
        {input("Branch Address", "branchAddress", "Business & Finance Centre, Opposite State Bankof Pakistan, Karachi", true)}
        {input("Account Title",  "accountTitle",  "S.K.F. COLLECTION")}
        {input("Address Line 1", "address1",      "SECTOR 16/1, SECTOR 12-D")}
        {input("Address Line 2", "address2",      "NORTH KARACHI")}
        {input("Address Line 3", "address3",      "INDUSTRIALAREA KARACHI.")}
        {input("Ref #",          "refNo",         "ICR\\1")}
        {input("Account No",     "accountNo",     "01990326001714103386")}
        {input("IBAN",           "iban",          "PK77SUMB9903207140103386")}
        {input("A/c Product",    "acProduct",     "CURRENT ACCOUNT")}
        {input("Currency",       "currency",      "PAKISTANI RUPEE")}
        {input("Old Account No", "oldAccountNo",  "01990326001714103386")}
        {input("From Date",      "fromDate",      "01-Mar-2025")}
        {input("To Date",        "toDate",        "30-Sep-2025")}
        {input("Opening Balance","openingBalance","299,065.58")}
        {input("Run By",         "runBy",         "akhtarshafi")}
      </div>
    </div>
  );
};
