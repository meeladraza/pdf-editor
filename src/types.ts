export type BankType = "ubl" | "faisal" | "meezan" | "metro" | "sonehri" | "dubai" | "mcb" | "alhabib" | "alfalah" | "hbl" | "bml" | "bankislami" | "mcbbank" | "jsbank";

export interface TransactionRow {
  date: string;
  particulars: string;
  instNo?: string;
  valueDate?: string;
  docNo?: string;
  debit: string;
  credit: string;
  balance: string;
  isOpeningBalance?: boolean;
  isClosingBalance?: boolean;
  // MCB Islamic specific
  tranBranch?: string;
  narrative?: string;
  extReference?: string;
}

export interface FaisalTransactionRow {
  postingDate: string;
  effectiveDate: string;
  narration: string;
  referenceNo: string;
  withdrawal: string;
  deposit: string;
  balance: string;
  isOpeningBalance?: boolean;
}

export interface UBLAccountInfo {
  branchCode: string;
  accountTitle: string;
  address1: string;
  address2: string;
  address3: string;
  regCellNo: string;
  ibanNo: string;
  cifNo: string;
  statementPeriod: string;
  accountNo: string;
  accountType: string;
  productType: string;
  currency: string;
  balance: string;
  asOf: string;
}

export interface FaisalAccountInfo {
  accountNo: string;
  accountTitle: string;
  address: string;
  address2: string;
  phoneNo: string;
  depositType: string;
  currency: string;
  statementPeriodFrom: string;
  statementPeriodTo: string;
  statementDate: string;
}

export interface MetroAccountInfo {
  accountTitle: string;
  address: string;
  branchName: string;
  acType: string;
  acNumber: string;
  iban: string;
  currency: string;
  from: string;
  to: string;
  printedOn: string;
}

export interface MeezanAccountInfo {
  branchName: string;
  branchAddress: string;
  accountTitle: string;
  address: string;
  address2?: string;
  printDate: string;
  iban: string;
  oldAccountNo?: string;
  accountNo: string;
  product: string;
  currency: string;
  fromDate: string;
  toDate: string;
  generatedBy: string;
  openingBalance?: string;
}

export interface SonehriAccountInfo {
  accountTitle: string;
  address: string;
  address2: string;
  accountNo: string;
  accountType: string;
  iban: string;
  oldNumber: string;
  bankName: string;
  currency: string;
  fromDate: string;
  toDate: string;
  branchName: string;
  printedDateTime: string;
}

export interface McbIslamicAccountInfo {
  fromDate: string;
  toDate: string;
  printDate: string;
  branchCode: string;
  branchName: string;
  accountTitle: string;
  mailingAddress: string;
  address2: string;
  mobileNo: string;
  accountNo: string;
  iban: string;
  currency: string;
  accountType: string;
  accountOpenDate: string;
  qrText: string;
  qrSubText: string;
  openingBalance: string;
  amountInReverse: string;
  availableBalance: string;
}

export interface BankAlHabibAccountInfo {
  printDate: string;
  branchCode: string;
  branchName: string;
  branchAddress: string;
  fromDate: string;
  toDate: string;
  accountName: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  accountNo: string;
  accountType: string;
  currency: string;
  qrText: string;
  qrSubText: string;
}

export interface BankAlFalahAccountInfo {
  printDateTime: string;
  stmtText: string;
  openingBalance: string;
  accountNo: string;
  iban: string;
  bookingDate: string;
}

export interface HBLAccountInfo {
  branchName: string;
  accountHolderName: string;
  address1: string;
  address2: string;
  address3: string;
  date: string;
  accountType: string;
  accountNo: string;
  currency: string;
  iban: string;
}

export interface DubaiIslamicAccountInfo {
  fromPeriod: string;
  toPeriod: string;
  currency: string;
  address: string;
  accountTitle: string;
  accountType: string;
  acOpeningDate: string;
  accountNo: string;
  iban: string;
  branch: string;
  openingBal: string;
  runDate: string;
}

export interface BankIslamiAccountInfo {
  issuingBranch: string;
  accountName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  phone1: string;
  phone2: string;
  issueDate: string;
  accountBranch: string;
  accountType: string;
  currency: string;
  accountNo: string;
  iban: string;
  fromDate: string;
  toDate: string;
  openingBalance: string;
  printedBy: string;
}

export interface BMLAccountInfo {
  branchName: string;
  branchAddress: string;
  accountTitle: string;
  address1: string;
  address2: string;
  address3: string;
  refNo: string;
  accountNo: string;
  iban: string;
  acProduct: string;
  currency: string;
  oldAccountNo: string;
  fromDate: string;
  toDate: string;
  openingBalance: string;
  runBy: string;
}

export interface JSBankAccountInfo {
  statementDate: string;      // "22 October 2025" (top-right header)
  statementTime: string;      // "15:10:14"
  accountName: string;        // "A R INDUSTRIES"
  attnName: string;           // "MUHAMMAD AQEEL PINGER"
  address1: string;
  address2: string;
  accountNo: string;
  oldAccountNo: string;
  ibanNo: string;
  accountType: string;
  currency: string;
  startDate: string;          // "20 OCT 2025"
  endDate: string;            // "20 OCT 2025"
  jointHolders: string;
  statementDateLabel: string; // "22 OCT 2025" (Statement Date field)
  openingBalance: string;
  user: string;               // "HIBAH.12494"
  timeDate: string;           // "15:10:14 22 OCT 2025"
}

export interface MCBAccountInfo {
  statementDateTime: string;
  branchInfo: string;
  accountTitle: string;
  address: string;
  accountNo: string;
  iban: string;
  accountType: string;
  currency: string;
  accountOpenDate: string;
  fromDate: string;
  toDate: string;
  openingBalance: string;
}
