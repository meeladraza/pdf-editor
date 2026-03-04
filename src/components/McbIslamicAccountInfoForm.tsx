import { McbIslamicAccountInfo } from "../types";

interface Props {
    accountInfo: McbIslamicAccountInfo;
    onChange: (info: McbIslamicAccountInfo) => void;
}

export const McbIslamicAccountInfoForm = ({ accountInfo, onChange }: Props) => {
    const handleChange = (field: keyof McbIslamicAccountInfo, value: string) => {
        onChange({ ...accountInfo, [field]: value });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                MCB Islamic Bank Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className={labelClass}>From Date</label>
                    <input type="text" value={accountInfo.fromDate} onChange={(e) => handleChange("fromDate", e.target.value)} className={inputClass} placeholder="01-Jan-2026" />
                </div>
                <div>
                    <label className={labelClass}>To Date</label>
                    <input type="text" value={accountInfo.toDate} onChange={(e) => handleChange("toDate", e.target.value)} className={inputClass} placeholder="31-Jan-2026" />
                </div>
                <div>
                    <label className={labelClass}>Print Date</label>
                    <input type="text" value={accountInfo.printDate} onChange={(e) => handleChange("printDate", e.target.value)} className={inputClass} placeholder="01-Feb-2026" />
                </div>
                <div>
                    <label className={labelClass}>Branch Code</label>
                    <input type="text" value={accountInfo.branchCode} onChange={(e) => handleChange("branchCode", e.target.value)} className={inputClass} placeholder="0452" />
                </div>
                <div>
                    <label className={labelClass}>Branch Name</label>
                    <input type="text" value={accountInfo.branchName} onChange={(e) => handleChange("branchName", e.target.value)} className={inputClass} placeholder="GULSHAN BRANCH" />
                </div>
                <div>
                    <label className={labelClass}>Account Title</label>
                    <input type="text" value={accountInfo.accountTitle} onChange={(e) => handleChange("accountTitle", e.target.value)} className={inputClass} placeholder="MUHAMMAD ALI" />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Account Mailing Address</label>
                    <textarea value={accountInfo.mailingAddress} onChange={(e) => handleChange("mailingAddress", e.target.value)} className={inputClass} placeholder="PLOT NO L-18, BLOCK 22, F.B AREA, KARACHI" rows={2} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Address Line 2</label>
                    <input type="text" value={accountInfo.address2} onChange={(e) => handleChange("address2", e.target.value)} className={inputClass} placeholder="INDUSTRIAL ARE KARACHI 03008266060" />
                </div>
                <div>
                    <label className={labelClass}>Mobile No</label>
                    <input type="text" value={accountInfo.mobileNo} onChange={(e) => handleChange("mobileNo", e.target.value)} className={inputClass} placeholder="03001234567" />
                </div>
                <div>
                    <label className={labelClass}>Account No</label>
                    <input type="text" value={accountInfo.accountNo} onChange={(e) => handleChange("accountNo", e.target.value)} className={inputClass} placeholder="0001234567890123" />
                </div>
                <div>
                    <label className={labelClass}>IBAN</label>
                    <input type="text" value={accountInfo.iban} onChange={(e) => handleChange("iban", e.target.value)} className={inputClass} placeholder="PK36MCIB0001234567890123" />
                </div>
                <div>
                    <label className={labelClass}>Currency</label>
                    <input type="text" value={accountInfo.currency} onChange={(e) => handleChange("currency", e.target.value)} className={inputClass} placeholder="PKR" />
                </div>
                <div>
                    <label className={labelClass}>Type of Account</label>
                    <input type="text" value={accountInfo.accountType} onChange={(e) => handleChange("accountType", e.target.value)} className={inputClass} placeholder="Current Account" />
                </div>
                <div>
                    <label className={labelClass}>Date of Account Open</label>
                    <input type="text" value={accountInfo.accountOpenDate} onChange={(e) => handleChange("accountOpenDate", e.target.value)} className={inputClass} placeholder="15-Mar-2020" />
                </div>
                <div>
                    <label className={labelClass}>QR Code Text</label>
                    <input type="text" value={accountInfo.qrText} onChange={(e) => handleChange("qrText", e.target.value)} className={inputClass} placeholder="PK36MCIB0001234567890123" />
                </div>
                <div>
                    <label className={labelClass}>QR Sub Text</label>
                    <input type="text" value={accountInfo.qrSubText} onChange={(e) => handleChange("qrSubText", e.target.value)} className={inputClass} placeholder="Scan to verify" />
                </div>
                <div>
                    <label className={labelClass}>Opening Balance</label>
                    <input type="text" value={accountInfo.openingBalance} onChange={(e) => handleChange("openingBalance", e.target.value)} className={inputClass} placeholder="50,000.00" />
                </div>
                <div>
                    <label className={labelClass}>Amount in Reverse</label>
                    <input type="text" value={accountInfo.amountInReverse} onChange={(e) => handleChange("amountInReverse", e.target.value)} className={inputClass} placeholder="0.00" />
                </div>
                <div>
                    <label className={labelClass}>Available Balance</label>
                    <input type="text" value={accountInfo.availableBalance} onChange={(e) => handleChange("availableBalance", e.target.value)} className={inputClass} placeholder="50,000.00" />
                </div>
            </div>
        </div>
    );
};
