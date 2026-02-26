import { useState } from "react";
// import { FileText } from 'lucide-react';
import { FileUpload } from "./components/FileUpload";
import { BankSelector } from "./components/BankSelector";
import { UBLAccountInfoForm } from "./components/UBLAccountInfoForm";
import { FaisalAccountInfoForm } from "./components/FaisalAccountInfoForm";
import { MeezanAccountInfoForm } from "./components/MeezanAccountInfoForm";
import { MetroAccountInfoForm } from "./components/MetroAccountInfoForm";
import { SonehriAccountInfoForm } from "./components/SonehriAccountInfoForm";
import { DubaiIslamicAccountInfoForm } from "./components/DubaiIslamicAccountInfoForm";
import { PreviewModal } from "./components/PreviewModal";
import {
  TransactionRow,
  FaisalTransactionRow,
  UBLAccountInfo,
  FaisalAccountInfo,
  MeezanAccountInfo,
  MetroAccountInfo,
  SonehriAccountInfo,
  DubaiIslamicAccountInfo,
  BankType,
} from "./types";
import { generateUBLHTML } from "./utils/UblHtmlGenerator";
import { generateFaisalHTML } from "./utils/faisalHTMLGenerator";
import { generateMeezanHTML } from "./utils/MeezanHtmlGenerator";
import { generateMetroHTML } from "./utils/metroHtmlGenerator";
import { generateSonehriHTML } from "./utils/sonehriHtmlGenerator";
import { generateDubaiHTML } from "./utils/dubaiHtmlGenerator";
import { generatePDF, downloadPDF } from "./utils/pdfGenerator";

function App() {
  const [selectedBank, setSelectedBank] = useState<BankType>("ubl");
  const [ublTransactions, setUblTransactions] = useState<TransactionRow[]>([]);
  const [faisalTransactions, setFaisalTransactions] = useState<
    FaisalTransactionRow[]
  >([]);
  const [meezanTransactions, setMeezanTransactions] = useState<
    TransactionRow[]
  >([]);
  const [metroTransactions, setMetroTransactions] = useState<TransactionRow[]>([]);
  const [sonehriTransactions, setSonehriTransactions] = useState<TransactionRow[]>([]);
  const [dubaiTransactions, setDubaiTransactions] = useState<TransactionRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const [ublAccountInfo, setUblAccountInfo] = useState<UBLAccountInfo>({
    branchCode: "0004-AMEEN SALEH MUHAMMAD ST. KHI",
    accountTitle: "AR INDUSTRIES",
    address1: "PLOT NO L-18 BLOCK NO 22",
    address2: "F. B AREA KARACHI KARACHI",
    address3: "KARACHI",
    regCellNo: "03219216849",
    ibanNo: "PK55 UNIL 0109 0003 0116 5884",
    cifNo: "22249075",
    statementPeriod: "From 01-OCT-2025 To 13-OCT-2025",
    accountNo: "000498400782",
    accountType: "SAVING",
    productType: "AMEEN BUSINESS ACCOUNT (ABA)",
    currency: "PAKISTANI RUPEE",
    balance: "3,207,779.56 Cr",
    asOf: "13-OCT-2025",
  });

  const [faisalAccountInfo, setFaisalAccountInfo] = useState<FaisalAccountInfo>(
    {
      accountNo: "0134007000004420",
      accountTitle: "A R INDUSTRIES",
      address: "PLOT NO.L-18 BLOCK NO.22",
      address2: "F.B AREA KARACHI",
      phoneNo: "03219216849",
      depositType: "CURRENT",
      currency: "PKR",
      statementPeriodFrom: "20-10-2025",
      statementPeriodTo: "20-10-2025",
      statementDate: "22-10-2025 13:40:49",
    },
  );

  const [metroAccountInfo, setMetroAccountInfo] = useState<MetroAccountInfo>({
    accountTitle: "S.K.F. COLLECTION",
    address: "SHOP# 124-125 1ST FLOOR TEXTILE PLAZA\nNEAR NEW MEMON MASJID MA JINNAH\nROAD, Karachi, Pakistan",
    branchName: "Textile Plaza Branch",
    acType: "Demand Deposits",
    acNumber: "6-1-42-20311-714-140781",
    iban: "PK61MPBL0142027140781",
    currency: "PKR",
    from: "01-Jul-2020",
    to: "30-Jun-2021",
    printedOn: "27-Sep-2021",
  });

  const [meezanAccountInfo, setMeezanAccountInfo] = useState<MeezanAccountInfo>(
    {
      branchName: "9937-NADIR HOUSE II-KARACHI",
      accountTitle: "AR INDUSTRIES",
      address: "PLOT NO. L-18, BLOCK 22, FEDERAL",
      address2:
        "'B' AREA, KARACHI CENTRAL GULBERG-TOWN, KARACHI (0321-9216849)",
      printDate: "22 OCT 2025 14:20:09",
      iban: "PK13MEZN0099370104122724",
      oldAccountNo: "",
      accountNo: "0104122724",
      product: "Meezan Rupee Current A/c",
      currency: "Pakistan Rupee",
      fromDate: "20 OCT 2025",
      toDate: "20 OCT 2025",
      generatedBy: "BAREERA.37233",
      openingBalance: "12642549.36",
    },
  );

  const [sonehriAccountInfo, setSonehriAccountInfo] = useState<SonehriAccountInfo>({
    accountTitle: "A.R INDUSTRIES",
    address: "PLOT NO L-18 BLOCK NO 22\nF. B AREA KARACHI",
    address2: "KARACHI",
    accountNo: "00123456789",
    accountType: "PKR-Jari Account Customers",
    iban: "PK00SONB0012345678901234",
    oldNumber: "",
    bankName: "SONERI BANK LIMITED",
    currency: "PKR",
    fromDate: "01 Oct 2025",
    toDate: "31 Oct 2025",
    branchName: "GULBERG BRANCH",
    printedDateTime: "25 OCT 2025 10:32:7 ",
  });

  const [dubaiAccountInfo, setDubaiAccountInfo] = useState<DubaiIslamicAccountInfo>({
    fromPeriod: "13-Feb-2026",
    toPeriod: "23-Feb-2026",
    currency: "PKR",
    address: "PLOT NO L 18/1/1/4 BLOCK\n22 FB AREA KARACHI",
    accountTitle: "RADIUM SILK FACTORY",
    accountType: "Current Accounts - Normal",
    acOpeningDate: "29-May-2015",
    accountNo: "0185811002",
    iban: "PK08DUIB0000000185811002",
    branch: "CLOTH MARKET BRANCH KARACHI",
    openingBal: "1,362,799.70",
    runDate: "23-Feb-2026",
  });

  const handleBankChange = (bank: BankType) => {
    setSelectedBank(bank);
    setUblTransactions([]);
    setFaisalTransactions([]);
    setMeezanTransactions([]);
    setMetroTransactions([]);
    setSonehriTransactions([]);
    setDubaiTransactions([]);
    setHtmlContent("");
  };

  const handleDataLoaded = (
    data: TransactionRow[] | FaisalTransactionRow[],
  ) => {
    if (selectedBank === "ubl") {
      setUblTransactions(data as TransactionRow[]);
    } else if (selectedBank === "faisal") {
      setFaisalTransactions(data as FaisalTransactionRow[]);
    } else if (selectedBank === "meezan") {
      setMeezanTransactions(data as TransactionRow[]);
    } else if (selectedBank === "metro") {
      setMetroTransactions(data as TransactionRow[]);
    } else if (selectedBank === "sonehri") {
      setSonehriTransactions(data as TransactionRow[]);
    } else if (selectedBank === "dubai") {
      setDubaiTransactions(data as TransactionRow[]);
    }
  };

  const handleUBLAccountInfoChange = (info: UBLAccountInfo) => {
    setUblAccountInfo(info);
  };

  const handleFaisalAccountInfoChange = (info: FaisalAccountInfo) => {
    setFaisalAccountInfo(info);
  };

  const handleMeezanAccountInfoChange = (info: MeezanAccountInfo) => {
    setMeezanAccountInfo(info);
  };

  const handleMetroAccountInfoChange = (info: MetroAccountInfo) => {
    setMetroAccountInfo(info);
  };

  const handleSonehriAccountInfoChange = (info: SonehriAccountInfo) => {
    setSonehriAccountInfo(info);
  };

  const handleDubaiAccountInfoChange = (info: DubaiIslamicAccountInfo) => {
    setDubaiAccountInfo(info);
  };

  const handleGeneratePreview = () => {
    let html = "";

    if (selectedBank === "ubl" && ublTransactions.length > 0) {
      html = generateUBLHTML(ublTransactions, ublAccountInfo);
    } else if (selectedBank === "faisal" && faisalTransactions.length > 0) {
      html = generateFaisalHTML(faisalTransactions, faisalAccountInfo);
    } else if (selectedBank === "meezan" && meezanTransactions.length > 0) {
      html = generateMeezanHTML(meezanTransactions, meezanAccountInfo);
    } else if (selectedBank === "metro" && metroTransactions.length > 0) {
      html = generateMetroHTML(metroTransactions, metroAccountInfo);
    } else if (selectedBank === "sonehri" && sonehriTransactions.length > 0) {
      html = generateSonehriHTML(sonehriTransactions, sonehriAccountInfo);
    } else if (selectedBank === "dubai" && dubaiTransactions.length > 0) {
      html = generateDubaiHTML(dubaiTransactions, dubaiAccountInfo);
    }

    if (html) {
      setHtmlContent(html);
      setIsModalOpen(true);
    } else {
      alert("Please upload an Excel file first");
    }
  };

  const handleDownloadPDF = async () => {
    if (!htmlContent) {
      alert("Please generate preview first");
      return;
    }

    try {
      const pdfData = await generatePDF(htmlContent);
      const filename = `${selectedBank}-bank-statement.pdf`;
      downloadPDF(pdfData, filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
      throw error;
    }
  };

  const hasTransactions =
    selectedBank === "ubl"
      ? ublTransactions.length > 0
      : selectedBank === "faisal"
        ? faisalTransactions.length > 0
        : selectedBank === "meezan"
          ? meezanTransactions.length > 0
          : selectedBank === "metro"
            ? metroTransactions.length > 0
            : selectedBank === "sonehri"
              ? sonehriTransactions.length > 0
              : dubaiTransactions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* <FileText className="w-12 h-12 text-blue-600 mr-3" /> */}
            <h1 className="text-4xl font-bold text-gray-800">
              Bank Statement Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Select your bank, upload Excel file, and generate professional PDF
            bank statements
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <BankSelector
            selectedBank={selectedBank}
            onBankChange={handleBankChange}
          />

          <FileUpload onDataLoaded={handleDataLoaded} bankType={selectedBank} />

          {hasTransactions && (
            <>
              {selectedBank === "ubl" ? (
                <UBLAccountInfoForm
                  accountInfo={ublAccountInfo}
                  onChange={handleUBLAccountInfoChange}
                />
              ) : selectedBank === "faisal" ? (
                <FaisalAccountInfoForm
                  accountInfo={faisalAccountInfo}
                  onChange={handleFaisalAccountInfoChange}
                />
              ) : selectedBank === "meezan" ? (
                <MeezanAccountInfoForm
                  accountInfo={meezanAccountInfo}
                  onChange={handleMeezanAccountInfoChange}
                />
              ) : selectedBank === "metro" ? (
                <MetroAccountInfoForm
                  accountInfo={metroAccountInfo}
                  onChange={handleMetroAccountInfoChange}
                />
              ) : selectedBank === "sonehri" ? (
                <SonehriAccountInfoForm
                  accountInfo={sonehriAccountInfo}
                  onChange={handleSonehriAccountInfoChange}
                />
              ) : (
                <DubaiIslamicAccountInfoForm
                  accountInfo={dubaiAccountInfo}
                  onChange={handleDubaiAccountInfoChange}
                />
              )}

              <button
                onClick={handleGeneratePreview}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-lg"
              >
                Generate Preview
              </button>
            </>
          )}
        </div>

        <PreviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          htmlContent={htmlContent}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
}

export default App;
