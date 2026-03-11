import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Building2, FileSpreadsheet, Download,
  Eye, CheckCircle2, ChevronRight, LogOut, Users,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { FileUpload } from "./components/FileUpload";
import { BankSelector } from "./components/BankSelector";
import { UBLAccountInfoForm } from "./components/UBLAccountInfoForm";
import { FaisalAccountInfoForm } from "./components/FaisalAccountInfoForm";
import { MeezanAccountInfoForm } from "./components/MeezanAccountInfoForm";
import { MetroAccountInfoForm } from "./components/MetroAccountInfoForm";
import { SonehriAccountInfoForm } from "./components/SonehriAccountInfoForm";
import { DubaiIslamicAccountInfoForm } from "./components/DubaiIslamicAccountInfoForm";
import { McbIslamicAccountInfoForm } from "./components/McbIslamicAccountInfoForm";
import { BankAlHabibAccountInfoForm } from "./components/BankAlHabibAccountInfoForm";
import { BankAlFalahAccountInfoForm } from "./components/BankAlFalahAccountInfoForm";
import { HBLAccountInfoForm } from "./components/HBLAccountInfoForm";
import { BMLAccountInfoForm } from "./components/BMLAccountInfoForm";
import { BankIslamiAccountInfoForm } from "./components/BankIslamiAccountInfoForm";
import { McbAccountInfoForm } from "./components/McbAccountInfoForm";
import { JsBankAccountInfoForm } from "./components/JsBankAccountInfoForm";
import { AccountSelectorModal } from "./components/AccountSelectorModal";
import { PreviewModal } from "./components/PreviewModal";
import { bankAccountProfiles, PRESERVED_FIELDS, AccountProfile } from "./data/bankAccounts";
import {
  TransactionRow, FaisalTransactionRow,
  UBLAccountInfo, FaisalAccountInfo, MeezanAccountInfo,
  MetroAccountInfo, SonehriAccountInfo, DubaiIslamicAccountInfo,
  McbIslamicAccountInfo, BankAlHabibAccountInfo, BankAlFalahAccountInfo,
  HBLAccountInfo, BMLAccountInfo, BankIslamiAccountInfo, MCBAccountInfo, JSBankAccountInfo, BankType,
} from "./types";
import { generateUBLHTML } from "./utils/UblHtmlGenerator";
import { generateFaisalHTML } from "./utils/faisalHtmlGenerator";
import { generateMeezanHTML } from "./utils/MeezanHtmlGenerator";
import { generateMetroHTML } from "./utils/metroHtmlGenerator";
import { generateSonehriHTML } from "./utils/sonehriHtmlGenerator";
import { generateDubaiHTML } from "./utils/dubaiHtmlGenerator";
import { generateMcbIslamicHTML } from "./utils/mcbIslamicHtmlGenerator";
import { generateBankAlHabibHTML } from "./utils/bankAlHabibHtmlGenerator";
import { generateBankAlFalahHTML } from "./utils/bankAlFalahHtmlGenerator";
import { generateHBLHTML } from "./utils/hblHtmlGenerator";
import { generateBMLHTML } from "./utils/bmlHtmlGenerator";
import { generateBankIslamiHTML } from "./utils/bankIslamiHtmlGenerator";
import { generateMCBHTML } from "./utils/mcbHtmlGenerator";
import { generateJsBankHTML } from "./utils/jsBankHtmlGenerator";
import { generatePDF, downloadPDF } from "./utils/pdfGenerator";

function App() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const [selectedBank, setSelectedBank] = useState<BankType>("ubl");
  const [ublTransactions, setUblTransactions] = useState<TransactionRow[]>([]);
  const [faisalTransactions, setFaisalTransactions] = useState<FaisalTransactionRow[]>([]);
  const [meezanTransactions, setMeezanTransactions] = useState<TransactionRow[]>([]);
  const [metroTransactions, setMetroTransactions] = useState<TransactionRow[]>([]);
  const [sonehriTransactions, setSonehriTransactions] = useState<TransactionRow[]>([]);
  const [dubaiTransactions, setDubaiTransactions] = useState<TransactionRow[]>([]);
  const [mcbTransactions, setMcbTransactions] = useState<TransactionRow[]>([]);
  const [alhabibTransactions, setAlhabibTransactions] = useState<TransactionRow[]>([]);
  const [alfalahTransactions, setAlfalahTransactions] = useState<TransactionRow[]>([]);
  const [hblTransactions, setHblTransactions] = useState<TransactionRow[]>([]);
  const [bmlTransactions, setBmlTransactions] = useState<TransactionRow[]>([]);
  const [bankIslamiTransactions, setBankIslamiTransactions] = useState<TransactionRow[]>([]);
  const [mcbBankTransactions, setMcbBankTransactions] = useState<TransactionRow[]>([]);
  const [jsBankTransactions, setJsBankTransactions] = useState<TransactionRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountSelectorOpen, setIsAccountSelectorOpen] = useState(false);
  const [activeProfileIds, setActiveProfileIds] = useState<Record<string, string>>(
    () => Object.fromEntries(
      Object.entries(bankAccountProfiles).map(([bank, profiles]) => [bank, profiles[0]?.id ?? ""])
    )
  );
  const [htmlContent, setHtmlContent] = useState<string>("");

  // ── Account info state ──────────────────────────────────────────────────────
  const [ublAccountInfo, setUblAccountInfo] = useState<UBLAccountInfo>({
    branchCode: "0004-AMEEN SALEH MUHAMMAD ST. KHI",
    accountTitle: "SKF COLLECTION",
    address1: "PLOT NO 16/1, SECTOR 12-D NORTH",
    address2: "KARACHI INDUSTRIAL",
    address3: "AREA, KARACHI, PAKISTAN",
    regCellNo: "03219216849",
    ibanNo: "PK28 UNIL 0112 0004 9840 0782",
    cifNo: "30973783",
    statementPeriod: "From 01-OCT-2025 To 13-OCT-2025",
    accountNo: "000498400782",
    accountType: "SAVING",
    productType: "AMEEN BUSINESS ACCOUNT (ABA)",
    currency: "PAKISTANI RUPEE",
    balance: "3,207,779.56 Cr",
    asOf: "13-OCT-2025",
  });

  const [faisalAccountInfo, setFaisalAccountInfo] = useState<FaisalAccountInfo>({
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
  });

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

  const [meezanAccountInfo, setMeezanAccountInfo] = useState<MeezanAccountInfo>({
    branchName: "0110-CLOTH MARKET-KARACHI",
    branchAddress: "14, ATIQUE MARKET, BUNDER QUARTER, KARACHI",
    accountTitle: "SKF COLLECTION",
    address: "PLOT NO, 16/1, SECTOR 12-D, NORTH",
    address2: "KARACHI, KARACHI, (0311-8266060)",
    printDate: "22 OCT 2025 14:20:09",
    iban: "PK07MEZN0001100100604463",
    oldAccountNo: "",
    accountNo: "0100604463",
    product: "Meezan Rupee Current A/c",
    currency: "Pakistan Rupee",
    fromDate: "20 OCT 2025",
    toDate: "20 OCT 2025",
    generatedBy: "BAREERA.37233",
    openingBalance: "12642549.36",
  });

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

  const [mcbAccountInfo, setMcbAccountInfo] = useState<McbIslamicAccountInfo>({
    fromDate: "16-FEB-2026",
    toDate: "16-FEB-2026",
    printDate: "February, 17,2026 09:10 AM",
    branchCode: "126",
    branchName: "MEDICINE MARKET BRANCH Karachi",
    accountTitle: "SKF COLLECTION",
    mailingAddress: "SECTOR 16/1 12D NORTH KARACHI",
    address2: "INDUSTRIAL ARE KARACHI 03008266060",
    mobileNo: "923118266060",
    accountNo: "126100264968001",
    iban: "PK29MCIB126100264968001",
    currency: "PKR",
    accountType: "MCB Islamic Hidayat Current",
    accountOpenDate: "06-SEP-2018",
    qrText: "PK29MCIB126100264968001",
    qrSubText: "SKF COLLECTION - 0001",
    openingBalance: "50,000.00",
    amountInReverse: "0.00",
    availableBalance: "50,000.00",
  });

  const [alfalahAccountInfo, setAlfalahAccountInfo] = useState<BankAlFalahAccountInfo>({
    printDateTime: "10/22/25, 3:53 PM",
    stmtText: "STMT.ENT.BOOK.3.BR",
    openingBalance: "315.44",
    accountNo: "1009345774",
    iban: "PK0010001",
    bookingDate: "20",
  });

  const [bmlAccountInfo, setBmlAccountInfo] = useState<BMLAccountInfo>({
    branchName:     "II Chundrigar Road Br,Khi(IBB)",
    branchAddress:  "Business & Finance Centre, Opposite State Bankof Pakistan, Karachi",
    accountTitle:   "S.K.F. COLLECTION",
    address1:       "SECTOR 16/1, SECTOR 12-D",
    address2:       "NORTH KARACHI",
    address3:       "INDUSTRIALAREA KARACHI.",
    refNo:          "ICR\\1",
    accountNo:      "01990326001714103386",
    iban:           "PK77SUMB9903207140103386",
    acProduct:      "CURRENT ACCOUNT",
    currency:       "PAKISTANI RUPEE",
    oldAccountNo:   "01990326001714103386",
    fromDate:       "01-Mar-2025",
    toDate:         "30-Sep-2025",
    openingBalance: "299,065.58",
    runBy:          "akhtarshafi",
  });

  const [hblAccountInfo, setHblAccountInfo] = useState<HBLAccountInfo>({
    branchName: "BAITUL HAMDM.A.JINNAH RD. KARACHI",
    accountHolderName: "SKF COLLECTION",
    address1: "PLOT NO.16/1, SECTOR12-D, NORTH KARACHI",
    address2: "INDUSTRIAL AREA",
    address3: "KARACHI",
    date: "24 Nov 2025",
    accountType: "ISLAMIC CURRENT ACCOUNT",
    accountNo: "0004*******60-03",
    currency: "Pakistan Rupee",
    iban: "PK84 **** **** **** 6003",
  });

  const [alhabibAccountInfo, setAlhabibAccountInfo] = useState<BankAlHabibAccountInfo>({
    printDate: "22/10/2025",
    branchCode: "1011",
    branchName: "BOULTON MARKET BRANCH - 1089",
    branchAddress: "LOTIA HOUSE BUILDING SERIA QUARTER KARACHI PAKISTAN",
    fromDate: "20/10/2025",
    toDate: "20/10/2025",
    accountName: "SKF COLLECTION",
    address1: "PLT NO 16/1, SECTOR 12-D",
    address2: "NORTH KARACHI INDUSTRIAL AREA",
    address3: "KARACHI",
    address4: "KARACHI - PAKISTAN",
    accountNo: "5008-0115-XXXXXX-00-1",
    accountType: "AL HABIB CURNT",
    currency: "PAKISTANI RUPEES",
    qrText: "5008-0115-XXXXXX-00-1",
    qrSubText: "SKF COLLECTION - 6101",
  });

  const [mcbBankAccountInfo, setMcbBankAccountInfo] = useState<MCBAccountInfo>({
    statementDateTime: "Mar 06, 2026 09:49:50 AM",
    branchInfo:        "0018-KARACHI BUNDER ROAD",
    accountTitle:      "SKF COLLECTION",
    address:           "PLOT # 16/1 SECTOR 12/D  NORTH KARACHI\nINDUSTRIAL AREA  \\KARACHI  0311-8266060",
    accountNo:         "0751397851001165",
    iban:              "PK10MUCB0751397851001165",
    accountType:       "BUS",
    currency:          "PKR",
    accountOpenDate:   "28-JAN-15",
    fromDate:          "05-MAR-26",
    toDate:            "05-MAR-26",
    openingBalance:    "1,717,177.70",
  });

  const [jsBankAccountInfo, setJsBankAccountInfo] = useState<JSBankAccountInfo>({
    statementDate:      "22 October 2025",
    statementTime:      "15:10:14",
    accountName:        "A R INDUSTRIES",
    attnName:           "MUHAMMAD AQEEL PINGER",
    address1:           "PLOT NO F 73 SITE SUPER HIGWAY",
    address2:           "PHASE 2 MALIR GADAP TOWN KARACHI",
    accountNo:          "0001477430",
    oldAccountNo:       "PK64JSBL9519000001477430",
    ibanNo:             "PK64JSBL9519000001477430",
    accountType:        "1001-Current Accounts",
    currency:           "PKR",
    startDate:          "20 OCT 2025",
    endDate:            "20 OCT 2025",
    jointHolders:       "NONE",
    statementDateLabel: "22 OCT 2025",
    openingBalance:     "443,796.68",
    user:               "HIBAH.12494",
    timeDate:           "15:10:14 22 OCT 2025",
  });

  const [bankIslamiAccountInfo, setBankIslamiAccountInfo] = useState<BankIslamiAccountInfo>({
    issuingBranch:    "COCHINWALA MARKET",
    accountName:      "SKF COLLECTION",
    address1:         "plot no 16/1,",
    address2:         "sector 12 -d,",
    address3:         "north karachi industrial area karachi",
    city:             "KARACHI",
    phone1:           "03118266060",
    phone2:           "03118266060",
    issueDate:        "04-Mar-2026",
    accountBranch:    "COCHINWALA MARKET",
    accountType:      "Current Account",
    currency:         "Pakistani Rupee",
    accountNo:        "101200053710001",
    iban:             "PK83BKIP010120053710001",
    fromDate:         "25-Feb-2026",
    toDate:           "04-Mar-2026",
    openingBalance:   "PKR 1,970,265.83",
    printedBy:        "FW9806 on 3/4/2026 2:02 PM",
  });

  // ── Account profile selector ─────────────────────────────────────────────────
  const handleSelectProfile = (profile: AccountProfile) => {
    const apply = (setter: React.Dispatch<React.SetStateAction<any>>) => {
      setter((prev: any) => {
        const next = { ...prev };
        Object.entries(profile.data).forEach(([k, v]) => {
          if (!PRESERVED_FIELDS.has(k)) next[k] = v;
        });
        return next;
      });
    };
    if      (selectedBank === "ubl")        apply(setUblAccountInfo);
    else if (selectedBank === "faisal")     apply(setFaisalAccountInfo);
    else if (selectedBank === "meezan")     apply(setMeezanAccountInfo);
    else if (selectedBank === "metro")      apply(setMetroAccountInfo);
    else if (selectedBank === "sonehri")    apply(setSonehriAccountInfo);
    else if (selectedBank === "dubai")      apply(setDubaiAccountInfo);
    else if (selectedBank === "mcb")        apply(setMcbAccountInfo);
    else if (selectedBank === "alhabib")    apply(setAlhabibAccountInfo);
    else if (selectedBank === "alfalah")    apply(setAlfalahAccountInfo);
    else if (selectedBank === "hbl")        apply(setHblAccountInfo);
    else if (selectedBank === "bml")        apply(setBmlAccountInfo);
    else if (selectedBank === "bankislami") apply(setBankIslamiAccountInfo);
    else if (selectedBank === "mcbbank")    apply(setMcbBankAccountInfo);
    else if (selectedBank === "jsbank")     apply(setJsBankAccountInfo);
    setActiveProfileIds(prev => ({ ...prev, [selectedBank]: profile.id }));
    setIsAccountSelectorOpen(false);
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleBankChange = (bank: BankType) => {
    setSelectedBank(bank);
    setUblTransactions([]);
    setFaisalTransactions([]);
    setMeezanTransactions([]);
    setMetroTransactions([]);
    setSonehriTransactions([]);
    setDubaiTransactions([]);
    setMcbTransactions([]);
    setAlhabibTransactions([]);
    setAlfalahTransactions([]);
    setHblTransactions([]);
    setBmlTransactions([]);
    setBankIslamiTransactions([]);
    setMcbBankTransactions([]);
    setJsBankTransactions([]);
    setHtmlContent("");
  };

  const handleDataLoaded = (data: TransactionRow[] | FaisalTransactionRow[]) => {
    if (selectedBank === "ubl") setUblTransactions(data as TransactionRow[]);
    else if (selectedBank === "faisal") setFaisalTransactions(data as FaisalTransactionRow[]);
    else if (selectedBank === "meezan") setMeezanTransactions(data as TransactionRow[]);
    else if (selectedBank === "metro") setMetroTransactions(data as TransactionRow[]);
    else if (selectedBank === "sonehri") setSonehriTransactions(data as TransactionRow[]);
    else if (selectedBank === "dubai") setDubaiTransactions(data as TransactionRow[]);
    else if (selectedBank === "mcb") setMcbTransactions(data as TransactionRow[]);
    else if (selectedBank === "alhabib") setAlhabibTransactions(data as TransactionRow[]);
    else if (selectedBank === "alfalah") setAlfalahTransactions(data as TransactionRow[]);
    else if (selectedBank === "hbl")        setHblTransactions(data as TransactionRow[]);
    else if (selectedBank === "bml")        setBmlTransactions(data as TransactionRow[]);
    else if (selectedBank === "bankislami") setBankIslamiTransactions(data as TransactionRow[]);
    else if (selectedBank === "mcbbank")    setMcbBankTransactions(data as TransactionRow[]);
    else if (selectedBank === "jsbank")     setJsBankTransactions(data as TransactionRow[]);
  };

  const handleGeneratePreview = async () => {
    let html = "";
    if (selectedBank === "ubl" && ublTransactions.length > 0)
      html = await generateUBLHTML(ublTransactions, ublAccountInfo);
    else if (selectedBank === "faisal" && faisalTransactions.length > 0)
      html = generateFaisalHTML(faisalTransactions, faisalAccountInfo);
    else if (selectedBank === "meezan" && meezanTransactions.length > 0)
      html = generateMeezanHTML(meezanTransactions, meezanAccountInfo);
    else if (selectedBank === "metro" && metroTransactions.length > 0)
      html = generateMetroHTML(metroTransactions, metroAccountInfo);
    else if (selectedBank === "sonehri" && sonehriTransactions.length > 0)
      html = await generateSonehriHTML(sonehriTransactions, sonehriAccountInfo);
    else if (selectedBank === "dubai" && dubaiTransactions.length > 0)
      html = generateDubaiHTML(dubaiTransactions, dubaiAccountInfo);
    else if (selectedBank === "mcb" && mcbTransactions.length > 0)
      html = generateMcbIslamicHTML(mcbTransactions, mcbAccountInfo);
    else if (selectedBank === "alhabib" && alhabibTransactions.length > 0)
      html = await generateBankAlHabibHTML(alhabibTransactions, alhabibAccountInfo);
    else if (selectedBank === "alfalah" && alfalahTransactions.length > 0)
      html = await generateBankAlFalahHTML(alfalahTransactions, alfalahAccountInfo);
    else if (selectedBank === "hbl" && hblTransactions.length > 0)
      html = await generateHBLHTML(hblTransactions, hblAccountInfo);
    else if (selectedBank === "bml" && bmlTransactions.length > 0)
      html = await generateBMLHTML(bmlTransactions, bmlAccountInfo);
    else if (selectedBank === "bankislami" && bankIslamiTransactions.length > 0)
      html = await generateBankIslamiHTML(bankIslamiTransactions, bankIslamiAccountInfo);
    else if (selectedBank === "mcbbank" && mcbBankTransactions.length > 0)
      html = await generateMCBHTML(mcbBankTransactions, mcbBankAccountInfo);
    else if (selectedBank === "jsbank" && jsBankTransactions.length > 0)
      html = await generateJsBankHTML(jsBankTransactions, jsBankAccountInfo);

    if (html) { setHtmlContent(html); setIsModalOpen(true); }
    else alert("Please upload an Excel file first");
  };

  const handleDownloadPDF = async () => {
    const pdfData = await generatePDF(htmlContent);
    downloadPDF(pdfData, `${selectedBank}-bank-statement.pdf`);
  };

  const hasTransactions =
    selectedBank === "ubl" ? ublTransactions.length > 0 :
      selectedBank === "faisal" ? faisalTransactions.length > 0 :
        selectedBank === "meezan" ? meezanTransactions.length > 0 :
          selectedBank === "metro" ? metroTransactions.length > 0 :
            selectedBank === "sonehri" ? sonehriTransactions.length > 0 :
              selectedBank === "dubai" ? dubaiTransactions.length > 0 :
                selectedBank === "mcb" ? mcbTransactions.length > 0 :
                  selectedBank === "alhabib" ? alhabibTransactions.length > 0 :
                    selectedBank === "alfalah" ? alfalahTransactions.length > 0 :
                      selectedBank === "hbl" ? hblTransactions.length > 0 :
                        selectedBank === "bml" ? bmlTransactions.length > 0 :
                          selectedBank === "bankislami" ? bankIslamiTransactions.length > 0 :
                            selectedBank === "mcbbank" ? mcbBankTransactions.length > 0 :
                              jsBankTransactions.length > 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">

      {/* ══ LEFT SIDEBAR ════════════════════════════════════════════════════ */}
      <aside className="w-72 min-w-[288px] bg-white border-r border-slate-200 shadow-md flex flex-col z-10 overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-sm leading-tight">Statement Generator</h1>
              <p className="text-blue-200 text-[11px] mt-0.5">Bank PDF Generator</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-lg flex items-center justify-center transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 px-4 py-5 flex flex-col gap-5">

          {/* Step 1 — Select Bank */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold">1</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Bank</span>
            </div>
            <BankSelector selectedBank={selectedBank} onBankChange={handleBankChange} />
          </div>

          <div className="border-t border-slate-100" />

          {/* Step 2 — Upload Excel */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${hasTransactions ? "bg-green-500" : "bg-slate-300"}`}>
                {hasTransactions
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  : <span className="text-white text-[10px] font-bold">2</span>}
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upload Excel</span>
            </div>
            {/* key prop remounts FileUpload on bank change, resetting filename display */}
            <FileUpload key={selectedBank} onDataLoaded={handleDataLoaded} bankType={selectedBank} />
          </div>

          {/* Step 3 — Generate (shown only after upload) */}
          {hasTransactions && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">3</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Generate PDF</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Edit account details on the right, then click generate.
                </p>
                <button
                  onClick={handleGeneratePreview}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  Preview &amp; Download
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0">
          <p className="text-[10px] text-slate-400 text-center">14 bank templates · A4 PDF export</p>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {hasTransactions ? (

          /* Account info form */
          <div className="p-6 container mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-800">Account Information</h2>
                <p className="text-xs text-slate-500">
                  Edit the fields below, then click <strong>Preview &amp; Download</strong> in the left panel.
                </p>
              </div>
              <button
                onClick={() => setIsAccountSelectorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-all shrink-0"
              >
                <Users className="w-3.5 h-3.5" />
                Switch Account
              </button>
            </div>

            {selectedBank === "ubl" ? (
              <UBLAccountInfoForm accountInfo={ublAccountInfo} onChange={setUblAccountInfo} />
            ) : selectedBank === "faisal" ? (
              <FaisalAccountInfoForm accountInfo={faisalAccountInfo} onChange={setFaisalAccountInfo} />
            ) : selectedBank === "meezan" ? (
              <MeezanAccountInfoForm accountInfo={meezanAccountInfo} onChange={setMeezanAccountInfo} />
            ) : selectedBank === "metro" ? (
              <MetroAccountInfoForm accountInfo={metroAccountInfo} onChange={setMetroAccountInfo} />
            ) : selectedBank === "sonehri" ? (
              <SonehriAccountInfoForm accountInfo={sonehriAccountInfo} onChange={setSonehriAccountInfo} />
            ) : selectedBank === "dubai" ? (
              <DubaiIslamicAccountInfoForm accountInfo={dubaiAccountInfo} onChange={setDubaiAccountInfo} />
            ) : selectedBank === "mcb" ? (
              <McbIslamicAccountInfoForm accountInfo={mcbAccountInfo} onChange={setMcbAccountInfo} />
            ) : selectedBank === "alhabib" ? (
              <BankAlHabibAccountInfoForm accountInfo={alhabibAccountInfo} onChange={setAlhabibAccountInfo} />
            ) : selectedBank === "alfalah" ? (
              <BankAlFalahAccountInfoForm accountInfo={alfalahAccountInfo} onChange={setAlfalahAccountInfo} />
            ) : selectedBank === "hbl" ? (
              <HBLAccountInfoForm accountInfo={hblAccountInfo} onChange={setHblAccountInfo} />
            ) : selectedBank === "bml" ? (
              <BMLAccountInfoForm accountInfo={bmlAccountInfo} onChange={setBmlAccountInfo} />
            ) : selectedBank === "bankislami" ? (
              <BankIslamiAccountInfoForm accountInfo={bankIslamiAccountInfo} onChange={setBankIslamiAccountInfo} />
            ) : selectedBank === "mcbbank" ? (
              <McbAccountInfoForm accountInfo={mcbBankAccountInfo} onChange={setMcbBankAccountInfo} />
            ) : (
              <JsBankAccountInfoForm accountInfo={jsBankAccountInfo} onChange={setJsBankAccountInfo} />
            )}
          </div>

        ) : (

          /* Empty state */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <FileSpreadsheet className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 mb-2">Ready to Generate</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Select a bank from the left panel and upload your Excel file to customize and generate the PDF statement.
              </p>
              <div className="space-y-2.5 text-left">
                {([
                  { Icon: Building2, color: "blue", title: "9 Bank Templates", sub: "UBL, Meezan, MCB, AlFalah & more" },
                  { Icon: FileSpreadsheet, color: "green", title: "Excel Import", sub: "Upload .xlsx or .xls files" },
                  { Icon: Download, color: "purple", title: "PDF Export", sub: "Professional A4 bank statements" },
                ] as const).map(({ Icon, color, title, sub }) => (
                  <div key={title} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-${color}-100`}>
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{title}</div>
                      <div className="text-xs text-slate-400">{sub}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <PreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        htmlContent={htmlContent}
        onDownloadPDF={handleDownloadPDF}
      />

      <AccountSelectorModal
        isOpen={isAccountSelectorOpen}
        onClose={() => setIsAccountSelectorOpen(false)}
        profiles={bankAccountProfiles[selectedBank] ?? []}
        onSelect={handleSelectProfile}
        activeProfileId={activeProfileIds[selectedBank] ?? ""}
      />
    </div>
  );
}

export default App;
