export const PRESERVED_FIELDS = new Set([
  // Statement dates — change per statement run
  "statementPeriod",
  "statementPeriodFrom",
  "statementPeriodTo",
  "statementDate",
  "statementDateTime",
  "fromDate",
  "toDate",
  "from",
  "to",
  "fromPeriod",
  "toPeriod",
  "printDate",
  "printedDateTime",
  "printDateTime",
  "printedOn",
  "runDate",
  "issueDate",
  "date",
  "asOf",
  "bookingDate",
  // Balances — change per statement
  "openingBalance",
  "closingBalance",
  "availableBalance",
  "amountInReverse",
  "balance",
  "openingBal",
  // Print operators
  "runBy",
  "printedBy",
]);

export interface AccountProfile {
  id: string;
  label: string;
  subtitle?: string;
  data: Record<string, string>;
}

export const bankAccountProfiles: Record<string, AccountProfile[]> = {
  ubl: [
    {
      id: "ubl-2",
      label: "SKF COLLECTION",
      subtitle: "0004-AMEEN SALEH MUHAMMAD ST. KHI",
      data: {
        branchCode: "0004-AMEEN SALEH MUHAMMAD ST. KHI",
        accountTitle: "SKF COLLECTION",
        address1: "PLOT NO 16/1, SECTOR 12-D NORTH",
        address2: "KARACHI INDUSTRIAL",
        address3: "AREA, KARACHI, PAKISTAN",
        regCellNo: "03219216849",
        ibanNo: "PK28 UNIL 0112 0004 9840 0782",
        cifNo: "30973783",
        accountNo: "000498400782",
        accountType: "SAVING",
        productType: "AMEEN BUSINESS ACCOUNT (ABA)",
        currency: "PAKISTANI RUPEE",
      },
    },
    {
      id: "ubl-1",
      label: "AR INDUSTRIES",
      subtitle: "0004-AMEEN SALEH MUHAMMAD ST. KHI",
      data: {
        branchCode: "0004-AMEEN SALEH MUHAMMAD ST. KHI",
        accountTitle: "AR INDUSTRIES",
        address1: "PLOT NO L-18 BLOCK NO 22",
        address2: "F. B AREA KARACHI KARACHI",
        address3: "KARACHI",
        regCellNo: "03219216849",
        ibanNo: "PK55 UNIL 0109 0003 0116 5884",
        cifNo: "22249075",
        accountNo: "000498400782",
        accountType: "SAVING",
        productType: "AMEEN BUSINESS ACCOUNT (ABA)",
        currency: "PAKISTANI RUPEE",
      },
    },
  ],

  faisal: [
    {
      id: "faisal-1",
      label: "A R INDUSTRIES",
      subtitle: "Faisal Bank",
      data: {
        accountNo: "0134007000004420",
        accountTitle: "A R INDUSTRIES",
        address: "PLOT NO.L-18 BLOCK NO.22",
        address2: "F.B AREA KARACHI",
        phoneNo: "03219216849",
        depositType: "CURRENT",
        currency: "PKR",
      },
    },
  ],

  meezan: [
    {
      id: "meezan-2",
      label: "SKF COLLECTION",
      subtitle: "0110-CLOTH MARKET-KARACHI",
      data: {
        branchName: "0110-CLOTH MARKET-KARACHI",
        branchAddress: "14, ATIQUE MARKET, BUNDER QUARTER, KARACHI",
        accountTitle: "SKF COLLECTION",
        address: "PLOT NO, 16/1, SECTOR 12-D, NORTH",
        address2: "KARACHI, KARACHI, (0311-8266060)",
        iban: "PK07MEZN0001100100604463",
        oldAccountNo: "",
        accountNo: "0100604463",
        product: "Meezan Rupee Current A/c",
        currency: "Pakistan Rupee",
        generatedBy: "BAREERA.37233",
      },
    },
    {
      id: "meezan-1",
      label: "AR INDUSTRIES",
      subtitle: "9937-NADIR HOUSE II-KARACHI",
      data: {
        branchName: "9937-NADIR HOUSE II-KARACHI",
        branchAddress: "NADIR HOUSE I I CHUNDRIGAR ROAD KARACHI",
        accountTitle: "AR INDUSTRIES",
        address: "PLOT NO. L-18, BLOCK 22, FEDERAL",
        address2:
          "'B' AREA, KARACHI CENTRAL GULBERG-TOWN, KARACHI (0321-9216849)",
        iban: "PK13MEZN0099370104122724",
        oldAccountNo: "",
        accountNo: "0104122724",
        product: "Meezan Rupee Current A/c",
        currency: "Pakistan Rupee",
        generatedBy: "BAREERA.37233",
      },
    },
  ],

  metro: [
    {
      id: "metro-1",
      label: "S.K.F. COLLECTION",
      subtitle: "Textile Plaza Branch",
      data: {
        accountTitle: "S.K.F. COLLECTION",
        address:
          "SHOP# 124-125 1ST FLOOR TEXTILE PLAZA\nNEAR NEW MEMON MASJID MA JINNAH\nROAD, Karachi, Pakistan",
        branchName: "Textile Plaza Branch",
        acType: "Demand Deposits",
        acNumber: "6-1-42-20311-714-140781",
        iban: "PK61MPBL0142027140781",
        currency: "PKR",
      },
    },
  ],

  sonehri: [
    {
      id: "sonehri-1",
      label: "A.R INDUSTRIES",
      subtitle: "GULBERG BRANCH",
      data: {
        accountTitle: "A.R INDUSTRIES",
        address: "PLOT NO L-18 BLOCK NO 22\nF. B AREA KARACHI",
        address2: "KARACHI",
        accountNo: "00123456789",
        accountType: "PKR-Jari Account Customers",
        iban: "PK00SONB0012345678901234",
        oldNumber: "",
        bankName: "SONERI BANK LIMITED",
        currency: "PKR",
        branchName: "GULBERG BRANCH",
      },
    },
  ],

  dubai: [
    {
      id: "dubai-1",
      label: "RADIUM SILK FACTORY",
      subtitle: "CLOTH MARKET BRANCH KARACHI",
      data: {
        currency: "PKR",
        address: "PLOT NO L 18/1/1/4 BLOCK\n22 FB AREA KARACHI",
        accountTitle: "RADIUM SILK FACTORY",
        accountType: "Current Accounts - Normal",
        acOpeningDate: "29-May-2015",
        accountNo: "0185811002",
        iban: "PK08DUIB0000000185811002",
        branch: "CLOTH MARKET BRANCH KARACHI",
      },
    },
  ],

  mcb: [
    {
      id: "mcb-1",
      label: "SKF COLLECTION",
      subtitle: "126-MEDICINE MARKET BRANCH",
      data: {
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
      },
    },
  ],

  alhabib: [
    {
      id: "alhabib-1",
      label: "A R INDUSTRIES",
      subtitle: "CLOTH MARKET BRANCH - 1011",
      data: {
        branchCode: "1011",
        branchName: "CLOTH MARKET BRANCH - 1011",
        branchAddress: "NEW NEHAM ROAD, KARACHI, PAKISTAN",
        accountName: "A R INDUSTRIES",
        address1: "PLT NO L-18 BLK # 22 FB AREA",
        address2: "KARACHI - PAKISTAN",
        accountNo: "1011-0981-XXXXXX-01-4",
        accountType: "AL HABIB CURNT PLUS",
        currency: "PAKISTANI RUPEES",
        qrText: "1011-0981-XXXXXX-01-4",
        qrSubText: "A R INDUSTRIES - 8701",
      },
    },
  ],

  alfalah: [
    {
      id: "alfalah-1",
      label: "AlFalah Account",
      subtitle: "Bank AlFalah",
      data: {
        stmtText: "STMT.ENT.BOOK.3.BR",
        accountNo: "1009345774",
        iban: "PK0010001",
      },
    },
  ],

  hbl: [
    {
      id: "hbl-1",
      label: "SKF COLLECTION",
      subtitle: "BAITUL HAMDM.A.JINNAH RD. KARACHI",
      data: {
        branchName: "BAITUL HAMDM.A.JINNAH RD. KARACHI",
        accountHolderName: "SKF COLLECTION",
        address1: "PLOT NO.16/1, SECTOR12-D, NORTH KARACHI",
        address2: "INDUSTRIAL AREA",
        address3: "KARACHI",
        accountType: "ISLAMIC CURRENT ACCOUNT",
        accountNo: "0004*******60-03",
        currency: "Pakistan Rupee",
        iban: "PK84 **** **** **** 6003",
      },
    },
    {
      id: "hbl-2",
      label: "RADIUM SILK FACTORY",
      subtitle: "BAITUL HAMDM.A.JINNAH RD. KARACHI",
      data: {
        branchName: "BAITUL HAMDM.A.JINNAH RD. KARACHI",
        accountHolderName: "RADIUM SILK FACTORY",
        address1: "PLOT NO.18/1/4 BLOCK NO.22",
        address2: "INDUSTRIAL AREA F.B.AREA",
        address3: "KARACHI",
        accountType: "ISLAMIC CURRENT ACCOUNT",
        accountNo: "0004*******61-03",
        currency: "Pakistan Rupee",
        iban: "PK03 **** **** **** 6103",
      },
    },
  ],

  bml: [
    {
      id: "bml-1",
      label: "S.K.F. COLLECTION",
      subtitle: "II Chundrigar Road Br,Khi(IBB)",
      data: {
        branchName: "II Chundrigar Road Br,Khi(IBB)",
        branchAddress:
          "Business & Finance Centre, Opposite State Bankof Pakistan, Karachi",
        accountTitle: "S.K.F. COLLECTION",
        address1: "SECTOR 16/1, SECTOR 12-D",
        address2: "NORTH KARACHI",
        address3: "INDUSTRIALAREA KARACHI.",
        refNo: "ICR\\1",
        accountNo: "01990326001714103386",
        iban: "PK77SUMB9903207140103386",
        acProduct: "CURRENT ACCOUNT",
        currency: "PAKISTANI RUPEE",
        oldAccountNo: "01990326001714103386",
      },
    },
  ],

  bankislami: [
    {
      id: "bankislami-1",
      label: "SKF COLLECTION",
      subtitle: "COCHINWALA MARKET",
      data: {
        issuingBranch: "COCHINWALA MARKET",
        accountName: "SKF COLLECTION",
        address1: "plot no 16/1,",
        address2: "sector 12 -d,",
        address3: "north karachi industrial area karachi",
        city: "KARACHI",
        phone1: "03118266060",
        phone2: "03118266060",
        accountBranch: "COCHINWALA MARKET",
        accountType: "Current Account",
        currency: "Pakistani Rupee",
        accountNo: "101200053710001",
        iban: "PK83BKIP010120053710001",
      },
    },
  ],

  mcbbank: [
    {
      id: "mcbbank-1",
      label: "SKF COLLECTION",
      subtitle: "0018-KARACHI BUNDER ROAD",
      data: {
        branchInfo: "0018-KARACHI BUNDER ROAD",
        accountTitle: "SKF COLLECTION",
        address:
          "PLOT # 16/1 SECTOR 12/D  NORTH KARACHI\nINDUSTRIAL AREA  \\KARACHI  0311-8266060",
        accountNo: "0751397851001165",
        iban: "PK10MUCB0751397851001165",
        accountType: "BUS",
        currency: "PKR",
        accountOpenDate: "28-JAN-15",
      },
    },
  ],
};
