import { FaisalTransactionRow, FaisalAccountInfo } from "../types";
import { formatNumber } from "./faisalExcelParser";

// ── Pagination constants ──────────────────────────────────────────────────────
// Content wrapper 760px < A4 at 96 dpi (794px) → no Chromium scale-to-fit.
// Page break happens at exactly A4 = 1123 CSS px.
const A4_HEIGHT_PX = 1123;

// Estimated static-section heights (px)
const HEADER_PX = 78; // logo row + border
const ACCOUNT_INFO_PX = 60; // 3-row info table + divider (first page only)
const TABLE_HEADER_PX = 27; // two-line column headings
const SUMMARY_PX = 48; // totals row + ending/available rows (last page)
const FOOTER_TEXT_PX = 62; // 3 disclaimer paragraphs (last page)
const ROW_HEIGHT_PX = 16; // 9.5px font + 3px×2 padding

// Conservative: subtract summary+footer from every page so the last page never overflows
const FIRST_PAGE_ROWS_PX =
  A4_HEIGHT_PX -
  HEADER_PX -
  ACCOUNT_INFO_PX -
  TABLE_HEADER_PX -
  SUMMARY_PX -
  FOOTER_TEXT_PX;
const OTHER_PAGE_ROWS_PX =
  A4_HEIGHT_PX - HEADER_PX - TABLE_HEADER_PX - SUMMARY_PX - FOOTER_TEXT_PX;

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateTransactions = (
  transactions: FaisalTransactionRow[],
): FaisalTransactionRow[][] => {
  const pages: FaisalTransactionRow[][] = [];
  let current: FaisalTransactionRow[] = [];
  let usedPx = 0;
  let available = FIRST_PAGE_ROWS_PX;

  for (const tx of transactions) {
    if (usedPx + ROW_HEIGHT_PX > available && current.length > 0) {
      pages.push(current);
      current = [];
      usedPx = 0;
      available = OTHER_PAGE_ROWS_PX;
    }
    current.push(tx);
    usedPx += ROW_HEIGHT_PX;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
};

// ── Shared cell style strings ─────────────────────────────────────────────────
const BORDER = "border:1px solid #000;";
const FONT = "font-family:Arial,sans-serif; font-size:9.5px;";
const TH = `border-top: 2px solid #585858; border-bottom: 2px solid #585858; ${FONT} font-weight:bold; padding:4px 3px 6px 3px;`;
const TD = `${FONT} padding:3px 5px;`;

// ── Header (every page) ───────────────────────────────────────────────────────
const generatePageHeader = (
  accountInfo: FaisalAccountInfo,
  pageNum: number,
  totalPages: number,
) => `
  <div style="display:flex; align-items:flex-start; justify-content:space-between;
              padding:12px 10px 6px 10px;">
    <div>
      <img src="/faisal-logo.png" alt="Faysal Bank" style="height:55px; width:auto; display:block;" />
    </div>
    <div style="flex:1; padding-left:18px;">
      <p style="font-size:20px; font-weight:600; font-family:Arial,sans-serif;
                margin:0; line-height:1.2;">Account Statement</p>
      <p style="font-size:9.2pt; font-family:Arial,sans-serif; font-weight:600; margin:12px 0 0 0;">
        Statement Period From:&nbsp;&nbsp;<u>${accountInfo.statementPeriodFrom}</u>&nbsp;&nbsp;&nbsp;To:&nbsp;&nbsp;<u>${accountInfo.statementPeriodTo}</u>
      </p>
    </div>
    <div style="text-align:right; padding-top:2px;">
      <p style="font-size:12px; font-family:Arial,sans-serif; font-weight:500; margin:0; padding-right: 20px;">
        Statement Date:&nbsp;&nbsp;${accountInfo.statementDate}
      </p>
      <p style="font-size:12px; font-family:Arial,sans-serif; font-weight:500; margin:7px 0 0 0; padding-right: 40px;">
        Page ${pageNum} of ${totalPages}
      </p>
    </div>
  </div>
`;

// ── Account Info (first page only) ────────────────────────────────────────────
const generateAccountInfo = (accountInfo: FaisalAccountInfo) => `
  <table style="width:100%; font-size:10px; font-family:Arial,sans-serif; margin-top: 16px;
                border-collapse:collapse;" cellspacing="0" cellpadding="0">
    <tr>
      <td style="width:13%; text-align:right; font-weight:bold; padding:5px 4px 10px 4px;">Account No :</td>
      <td style="width:25%; padding:5px 4px 10px 6px;">${accountInfo.accountNo}</td>
      <td style="width:12%; font-weight:bold; padding:5px 4px 10px 4px;">Title Of Account :</td>
      <td style="padding:5px 18px 10px 6px;">${accountInfo.accountTitle}</td>
    </tr>
    <tr>
      <td style="text-align:right; font-weight:bold; padding:3px 4px 10px 4px;">Address :</td>
      <td style="width:25%; padding:3px 18px 10px 6px;">
        ${accountInfo.address}
      </td>
      <td colspan="2" style="padding:3px 4px 10px 4px;">${accountInfo.address2}&nbsp;${accountInfo.phoneNo}</td>
    </tr>
    <tr>
      <td style="text-align:right; font-weight:bold; padding:3px 4px 14px 4px;">Deposit Type :</td>
      <td style="padding:3px 4px 14px 6px;">${accountInfo.depositType}</td>
      <td style="font-weight:bold; padding:3px 4px 14px 4px;"><p style="text-align: right;">Currency :</p></td>
      <td style="padding:3px 18px 14px 6px;">${accountInfo.currency}</td>
    </tr>
  </table>
`;

// ── Table column headers ──────────────────────────────────────────────────────
const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} border-left: 2px solid #585858; width:9%; text-align:center;">Posting<br/>Date</th>
      <th style="${TH} width:9%; text-align:center;">Effective<br/>Date</th>
      <th style="${TH} width:25%; text-align: left;">Narration</th>
      <th style="${TH} width:20%; text-align: left;">Reference No</th>
      <th style="${TH} width:14%; text-align: center;">Withdrawal</th>
      <th style="${TH} width:14%; text-align: center;">Deposit</th>
      <th style="${TH} border-right: 2px solid #585858; width:14%; text-align: center;">Balance</th>
    </tr>
  </thead>
`;

// ── Date helpers ──────────────────────────────────────────────────────────────
const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const MONTHS_NUM: Record<string, string> = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

// "DD-MMM-YYYY" → "DD-MM-YYYY"  |  "DD-MM-YYYY" → unchanged
const toDisplayDate = (dateStr: string): string => {
  const parts = dateStr.split(/[-/]/);
  if (parts.length !== 3) return dateStr;
  const day = parts[0].padStart(2, "0");
  const mid = parts[1].toUpperCase();
  const year = parts[2];
  const monthNum = MONTHS_NUM[mid];
  return monthNum ? `${day}-${monthNum}-${year}` : dateStr;
};

// "DD-MM-YYYY" or "DD-MMM-YYYY" → "DD-MMM-YY"  (e.g. "20-10-2025" → "20-OCT-25")
const toShortDate = (dateStr: string): string => {
  const normalized = toDisplayDate(dateStr);
  const parts = normalized.split(/[-/]/);
  if (parts.length !== 3) return dateStr;
  const day = parts[0].padStart(2, "0");
  const month = parseInt(parts[1], 10);
  const year = parts[2];
  if (month < 1 || month > 12) return dateStr;
  const yy = year.length === 4 ? year.slice(2) : year;
  return `${day}-${MONTHS_SHORT[month - 1]}-${yy}`;
};

// ── Transaction row ───────────────────────────────────────────────────────────
const generateTransactionRow = (tx: FaisalTransactionRow) => {
  if (tx.isOpeningBalance) {
    const label =
      tx.narration || `Opening Balance as of ${toShortDate(tx.postingDate)}`;
    return `
      <tr>
      <td colspan="2" style="${TD}"></td>
        <td colspan="4" style="${TD} font-weight:bold;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${label}
        </td>
        <td style="${TD} font-weight:bold; text-align:right;">${tx.balance}</td>
        
      </tr>
    `;
  }
  return `
    <tr>
      <td style="${TD} text-align:center;">${toDisplayDate(tx.postingDate)}</td>
      <td style="${TD} text-align:center;">${toDisplayDate(tx.effectiveDate)}</td>
      <td style="${TD} text-align:left;">${tx.narration}</td>
      <td style="${TD} text-align:left;">${tx.referenceNo}</td>
      <td style="${TD} text-align:right;">${tx.withdrawal || ""}</td>
      <td style="${TD} text-align:right;">${tx.deposit || ""}</td>
      <td style="${TD} text-align:right;">${tx.balance}</td>
    </tr>
  `;
};

// ── Summary / tfoot (last page only) ─────────────────────────────────────────
const generateSummary = (allTransactions: FaisalTransactionRow[]) => {
  const regular = allTransactions.filter((t) => !t.isOpeningBalance);
  let totalWithdrawal = 0;
  let totalDeposit = 0;
  let lastBalance = "";
  let lastDate = "";

  regular.forEach((tx) => {
    if (tx.withdrawal) {
      const n = parseFloat(String(tx.withdrawal).replace(/,/g, ""));
      if (!isNaN(n)) totalWithdrawal += n;
    }
    if (tx.deposit) {
      const n = parseFloat(String(tx.deposit).replace(/,/g, ""));
      if (!isNaN(n)) totalDeposit += n;
    }
    if (tx.balance) lastBalance = tx.balance;
    if (tx.postingDate) lastDate = tx.postingDate;
  });

  return `
    <tfoot style="border:2px solid #585858;">
      <tr style="border-bottom:2px solid #585858;">
        <td colspan="4" style="${TD}"></td>
        <td style="${TD} width:14%; font-weight:bold; text-align: center;">${formatNumber(totalWithdrawal)}</td>
        <td style="${TD} width:14%; font-weight:bold; text-align: center;">${formatNumber(totalDeposit)}</td>
        <td style="${TD}"></td>
      </tr>
      <tr>
        <td colspan="2" style="${TD} font-weight:bold;">No. of Transactions (${regular.length})</td>
        <td colspan="4" style="${TD} font-weight:bold;">Ending Balance as of ${toShortDate(lastDate)}</td>
        <td style="${TD} font-weight:bold; text-align:right; width:14%;">${lastBalance}</td>
      </tr>
      <tr>
        <td colspan="2" style="${TD}"></td>
        <td colspan="4" style="${TD} font-weight:bold;">Available Balance as of ${toShortDate(lastDate)}</td>
        <td style="${TD} font-weight:bold; text-align:right; width:14%;">${lastBalance}</td>
      </tr>
    </tfoot>
  `;
};

// ── Footer disclaimer text (last page only) ───────────────────────────────────
const generateFooterText = () => `
  <div style="padding:14px 10px 8px 10px; font-family:Arial,sans-serif;
              font-size:9px; font-weight:500; line-height:1.5; color:#000; width:50%%;">
    <p style="margin:0; line-height:1.2;">
      ***AS PER SBP MANDATE PLEASE SUBMIT AN ATTESTED COPY OF
    </p>
    <p style="margin:0; line-height:1.2;">YOUR VALID CNIC,
      IF NOT PROVIDED EARLIER. NON-PROVISION CAN</p>
      <p style="margin:0 0 8px 0; line-height:1.2;">
      HAMPER THE SERVICES***
      </p>
    <p style="margin:0; line-height:1.2;">
      ** FOR BANK'S PROFILE PLEASE VISIT OUR WEBSITE
    </p>
    <p style="margin:0 0 8px 0; line-height:1.2;">"WWW.FAYSALBANK.COM" **</p>
    <p style="margin:0; line-height:1.2;">
      "FOR COMPLAINTS WHICH REMAIN UNRESOLVED BEYOND 45 DAYS,"
    </p>
    <p style="margin:0; line-height:1.2;">YOU MAY WRITE TO
      BANKING MOHTASIB PAKISTAN, SHAHEEN</p>
      <p style="margin:0 line-height:1.2;">COMPLEX, M.R KIYANI ROAD, KARACHI OR
      VISIT</p>
      <p style="margin:0; line-height:1.2;">WWW.BANKINGMOHTASIB.GOV.PK</p>
  </div>
`;

// ── Single page wrapper ───────────────────────────────────────────────────────
const generatePageContent = (
  pageTxns: FaisalTransactionRow[],
  allTxns: FaisalTransactionRow[],
  accountInfo: FaisalAccountInfo,
  isFirstPage: boolean,
  isLastPage: boolean,
  pageNum: number,
  totalPages: number,
) => `
  <div style="page-break-before:${isFirstPage ? "auto" : "always"}; min-height:100vh;">
    ${generatePageHeader(accountInfo, pageNum, totalPages)}
    ${isFirstPage ? generateAccountInfo(accountInfo) : ""}
    <div style="padding:0 10px;">
      <table style="width:100%; border-collapse:collapse;" cellspacing="0">
        ${generateTableHeader()}
        <tbody>
          ${pageTxns.map((tx) => generateTransactionRow(tx)).join("")}
        </tbody>
        ${isLastPage ? generateSummary(allTxns) : ""}
      </table>
    </div>
    ${isLastPage ? generateFooterText() : ""}
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateFaisalHTML = (
  transactions: FaisalTransactionRow[],
  accountInfo: FaisalAccountInfo,
): string => {
  const pages = paginateTransactions(transactions);
  const totalPages = Math.max(1, pages.length);

  const pagesHtml = pages
    .map((pageTxns, idx) =>
      generatePageContent(
        pageTxns,
        transactions,
        accountInfo,
        idx === 0,
        idx === pages.length - 1,
        idx + 1,
        totalPages,
      ),
    )
    .join("");

  const styles = `
    @page { margin: 0; size: A4; }
    @media print {
      body { margin: 0; padding: 0; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }
      tr { page-break-inside: avoid; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; }
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Faysal Bank Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width:100%; background:#fff;">
          ${pagesHtml}
        </div>
      </body>
    </html>
  `;
};
