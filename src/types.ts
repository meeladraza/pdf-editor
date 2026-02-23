export type BankType = 'ubl' | 'faisal';

export interface TransactionRow {
  date: string;
  particulars: string;
  instNo: string;
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
  phoneNo: string;
  depositType: string;
  currency: string;
  statementPeriodFrom: string;
  statementPeriodTo: string;
  statementDate: string;
}
