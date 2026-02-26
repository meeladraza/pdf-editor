export type BankType = "ubl" | "faisal" | "meezan" | "metro" | "sonehri" | "dubai";

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
