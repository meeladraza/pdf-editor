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

export interface AccountInfo {
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
