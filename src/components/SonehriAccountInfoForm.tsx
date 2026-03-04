import { SonehriAccountInfo } from "../types";

interface SonehriAccountInfoFormProps {
    accountInfo: SonehriAccountInfo;
    onChange: (info: SonehriAccountInfo) => void;
}

export const SonehriAccountInfoForm = ({
    accountInfo,
    onChange,
}: SonehriAccountInfoFormProps) => {
    const handleChange = (field: keyof SonehriAccountInfo, value: string) => {
        onChange({ ...accountInfo, [field]: value });
    };

    return (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Sonehri Bank Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Title
                    </label>
                    <input
                        type="text"
                        value={accountInfo.accountTitle}
                        onChange={(e) => handleChange("accountTitle", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="A.R INDUSTRIES"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account No
                    </label>
                    <input
                        type="text"
                        value={accountInfo.accountNo}
                        onChange={(e) => handleChange("accountNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="00123456789"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        value={accountInfo.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="PLOT NO L-18 BLOCK NO 22 F. B AREA KARACHI"
                        rows={2}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address 2
                    </label>
                    <input
                        type="text"
                        value={accountInfo.address2}
                        onChange={(e) => handleChange("address2", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="KARACHI"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                    </label>
                    <input
                        type="text"
                        value={accountInfo.accountType}
                        onChange={(e) => handleChange("accountType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="PKR-Jari Account Customers"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        IBAN
                    </label>
                    <input
                        type="text"
                        value={accountInfo.iban}
                        onChange={(e) => handleChange("iban", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="PK00SONB00..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Old Number
                    </label>
                    <input
                        type="text"
                        value={accountInfo.oldNumber}
                        onChange={(e) => handleChange("oldNumber", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                    </label>
                    <input
                        type="text"
                        value={accountInfo.bankName}
                        onChange={(e) => handleChange("bankName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="SONERI BANK LIMITED"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                    </label>
                    <input
                        type="text"
                        value={accountInfo.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="PKR"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                    </label>
                    <input
                        type="text"
                        value={accountInfo.fromDate}
                        onChange={(e) => handleChange("fromDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="01 Oct 2025"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                    </label>
                    <input
                        type="text"
                        value={accountInfo.toDate}
                        onChange={(e) => handleChange("toDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="31 Oct 2025"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name
                    </label>
                    <input
                        type="text"
                        value={accountInfo.branchName}
                        onChange={(e) => handleChange("branchName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="GULBERG BRANCH"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Printed Date & Time
                    </label>
                    <input
                        type="text"
                        value={accountInfo.printedDateTime}
                        onChange={(e) => handleChange("printedDateTime", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="25 OCT 2025 10:30 AM"
                    />
                </div>
            </div>
        </div>
    );
};
