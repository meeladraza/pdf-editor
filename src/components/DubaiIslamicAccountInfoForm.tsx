import { DubaiIslamicAccountInfo } from "../types";

interface Props {
    accountInfo: DubaiIslamicAccountInfo;
    onChange: (info: DubaiIslamicAccountInfo) => void;
}

export const DubaiIslamicAccountInfoForm = ({ accountInfo, onChange }: Props) => {
    const handleChange = (field: keyof DubaiIslamicAccountInfo, value: string) => {
        onChange({ ...accountInfo, [field]: value });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Dubai Islamic Bank Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Statement Period From</label>
                    <input type="text" value={accountInfo.fromPeriod} onChange={(e) => handleChange("fromPeriod", e.target.value)} className={inputClass} placeholder="13-Feb-2026" />
                </div>
                <div>
                    <label className={labelClass}>Statement Period To</label>
                    <input type="text" value={accountInfo.toPeriod} onChange={(e) => handleChange("toPeriod", e.target.value)} className={inputClass} placeholder="23-Feb-2026" />
                </div>
                <div>
                    <label className={labelClass}>Currency</label>
                    <input type="text" value={accountInfo.currency} onChange={(e) => handleChange("currency", e.target.value)} className={inputClass} placeholder="PKR" />
                </div>
                <div>
                    <label className={labelClass}>Account Title</label>
                    <input type="text" value={accountInfo.accountTitle} onChange={(e) => handleChange("accountTitle", e.target.value)} className={inputClass} placeholder="RADIUM SILK FACTORY" />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Address</label>
                    <textarea value={accountInfo.address} onChange={(e) => handleChange("address", e.target.value)} className={inputClass} placeholder="PLOT NO L 18/1/1/4 BLOCK 22 FB AREA KARACHI" rows={2} />
                </div>
                <div>
                    <label className={labelClass}>Account Type</label>
                    <input type="text" value={accountInfo.accountType} onChange={(e) => handleChange("accountType", e.target.value)} className={inputClass} placeholder="Current Accounts - Normal" />
                </div>
                <div>
                    <label className={labelClass}>A/C Opening Date</label>
                    <input type="text" value={accountInfo.acOpeningDate} onChange={(e) => handleChange("acOpeningDate", e.target.value)} className={inputClass} placeholder="29-May-2015" />
                </div>
                <div>
                    <label className={labelClass}>Account No</label>
                    <input type="text" value={accountInfo.accountNo} onChange={(e) => handleChange("accountNo", e.target.value)} className={inputClass} placeholder="0185811002" />
                </div>
                <div>
                    <label className={labelClass}>IBAN A/C No</label>
                    <input type="text" value={accountInfo.iban} onChange={(e) => handleChange("iban", e.target.value)} className={inputClass} placeholder="PK08DUIB0000000185811002" />
                </div>
                <div>
                    <label className={labelClass}>Branch</label>
                    <input type="text" value={accountInfo.branch} onChange={(e) => handleChange("branch", e.target.value)} className={inputClass} placeholder="CLOTH MARKET BRANCH KARACHI" />
                </div>
                <div>
                    <label className={labelClass}>Opening Balance</label>
                    <input type="text" value={accountInfo.openingBal} onChange={(e) => handleChange("openingBal", e.target.value)} className={inputClass} placeholder="1,362,799.70" />
                </div>
                <div>
                    <label className={labelClass}>Run Date</label>
                    <input type="text" value={accountInfo.runDate} onChange={(e) => handleChange("runDate", e.target.value)} className={inputClass} placeholder="23-Feb-2026" />
                </div>
            </div>
        </div>
    );
};
