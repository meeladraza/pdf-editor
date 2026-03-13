import { AskariAccountInfo } from "../types";

interface Props {
  accountInfo: AskariAccountInfo;
  onChange: (info: AskariAccountInfo) => void;
}

export const AskariAccountInfoForm = ({ accountInfo, onChange }: Props) => {
  const set = (field: keyof AskariAccountInfo, value: string) =>
    onChange({ ...accountInfo, [field]: value });

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Askari Bank Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className={lbl}>Name</label>
          <input type="text" value={accountInfo.name} onChange={e => set("name", e.target.value)} className={inp} placeholder="RAZ TEXTILES" />
        </div>
        <div>
          <label className={lbl}>Phone</label>
          <input type="text" value={accountInfo.phone} onChange={e => set("phone", e.target.value)} className={inp} placeholder="03209251495" />
        </div>

        <div>
          <label className={lbl}>Address Line 1</label>
          <input type="text" value={accountInfo.address1} onChange={e => set("address1", e.target.value)} className={inp} placeholder="PLOT NO L-33/C," />
        </div>
        <div>
          <label className={lbl}>Address Line 2</label>
          <input type="text" value={accountInfo.address2} onChange={e => set("address2", e.target.value)} className={inp} placeholder="BLOCK 22," />
        </div>
        <div className="md:col-span-2">
          <label className={lbl}>Address Line 3</label>
          <input type="text" value={accountInfo.address3} onChange={e => set("address3", e.target.value)} className={inp} placeholder="FEDERAL B AREA KARACHI" />
        </div>

        <div className="md:col-span-2">
          <label className={lbl}>Branch Name</label>
          <input type="text" value={accountInfo.branchName} onChange={e => set("branchName", e.target.value)} className={inp} placeholder="IBB M.A Jinnah Road (Bolton Market)" />
        </div>

        <div>
          <label className={lbl}>From Date</label>
          <input type="text" value={accountInfo.fromDate} onChange={e => set("fromDate", e.target.value)} className={inp} placeholder="01-SEP-25" />
        </div>
        <div>
          <label className={lbl}>To Date</label>
          <input type="text" value={accountInfo.toDate} onChange={e => set("toDate", e.target.value)} className={inp} placeholder="25-FEB-26" />
        </div>

        <div>
          <label className={lbl}>Account Number</label>
          <input type="text" value={accountInfo.accountNumber} onChange={e => set("accountNumber", e.target.value)} className={inp} placeholder="7620200000395" />
        </div>
        <div>
          <label className={lbl}>Currency</label>
          <input type="text" value={accountInfo.currency} onChange={e => set("currency", e.target.value)} className={inp} placeholder="Pak Rupees" />
        </div>

        <div>
          <label className={lbl}>Account Type</label>
          <input type="text" value={accountInfo.accountType} onChange={e => set("accountType", e.target.value)} className={inp} placeholder="Current A/C (AICA)" />
        </div>
        <div>
          <label className={lbl}>Issued On</label>
          <input type="text" value={accountInfo.issuedOn} onChange={e => set("issuedOn", e.target.value)} className={inp} placeholder="25-Feb-2026" />
        </div>

      </div>
    </div>
  );
};
