import { TransactionRow, SonehriAccountInfo } from "../types";
import { formatNumber } from "./sonehriExcelParser";

// ── Palette and Styles ────────────────────────────────────────────────────────
const FONT_PRIMARY = "font-family: Arial, sans-serif;";

// ── Shared styles ─────────────────────────────────────────────────────────────
const TH_STYLE = `${FONT_PRIMARY} font-size: 7pt; font-weight: 580; padding: 6px 6px 8px 6px; background-color: #dedede; text-align: left;`;
const TD_STYLE = `${FONT_PRIMARY} font-size: 7pt; padding: 6px 6px 8px 6px;`;
const TD_BOLD  = `${TD_STYLE} font-weight: bold;`;

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX   = 1123;
const HEADER_PX      = 120;  // logo + date/time (with buffer)
const ACCT_INFO_PX   = 420; // account info — page 1 only (with buffer)
const TBL_HEADER_PX  = 40;  // column header row — page 1 only
const OPENING_BAL_PX = 28;  // opening balance row — page 1 only
const FOOTER_PX      = 87;  // page number footer
const ROW_HEIGHT_PX  = 26;  // 7pt font + padding(6+8) + buffer

// Page 1: header + acct info + table header + opening bal + rows + footer
const ROWS_PX_P1   = A4_HEIGHT_PX - HEADER_PX - ACCT_INFO_PX - TBL_HEADER_PX - OPENING_BAL_PX - FOOTER_PX;
// Page 2+: header + rows + footer only (no table header, no acct info)
const ROWS_PX_REST = A4_HEIGHT_PX - HEADER_PX - FOOTER_PX;

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateTransactions = (rows: TransactionRow[]): TransactionRow[][] => {
  // opening/closing balance rows rendered separately — exclude from pagination
  const regular = rows.filter(
    (tx) =>
      !tx.isOpeningBalance &&
      !tx.particulars.toLowerCase().includes("balance at period end"),
  );

  const pages: TransactionRow[][] = [];
  let current: TransactionRow[] = [];
  let usedPx = 0;
  let firstPage = true;

  for (const tx of regular) {
    const limit = firstPage ? ROWS_PX_P1 : ROWS_PX_REST;
    if (usedPx + ROW_HEIGHT_PX > limit && current.length > 0) {
      pages.push(current);
      current = [];
      usedPx = 0;
      firstPage = false;
    }
    current.push(tx);
    usedPx += ROW_HEIGHT_PX;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
};

// ── Header (logo + printed date/time) — every page ───────────────────────────
const generatePageHeader = (info: SonehriAccountInfo) => {
  const parts = info.printedDateTime.split(" ");
  const date = parts.slice(0, 3).join(" ");
  const time = parts.slice(3).join(" ");

  return `
    <div style="padding: 40px 0 6px 0;">
      <div style="width: 120px;">
        <img src="/soneri-logo.png" alt="Sonehri Bank" style="width: 100%; height: 45px; display: block;" />
      </div>
      <div style="${FONT_PRIMARY} display: flex; flex-direction: column; justify-content: flex-end; font-size: 6pt; text-align: right; line-height: 1.4;">
        <div style="font-weight: 600;">${date}</div>
        <div style="font-weight: 600;">${time}</div>
      </div>
    </div>
  `;
};

// ── Account Info Section (page 1 only) ────────────────────────────────────────
const generateAccountInfo = (info: SonehriAccountInfo) => `
  <div style="display: flex; gap: 10px; font-size: 7pt; font-weight: 580; ${FONT_PRIMARY} padding: 160px 0 10px 0;">
    <div style="width: 25%; display: flex; flex-direction: column;">
      <span style="margin-bottom: 12px;">Account</span>
      <span style="height: 36px;">Currency</span>
      <span style="margin-bottom: 12px;">Account Type</span>
      <span style="margin-bottom: 12px;">From Date</span>
      <span style="margin-bottom: 12px;">To Date</span>
      <span style="margin-bottom: 12px;">Statement Date</span>
      <span style="margin-bottom: 4px;">Page</span>
    </div>
    <div style="width: 25%; display: flex; flex-direction: column;">
      <span style="margin-bottom: 12px;">${info.accountNo}</span>
      <span style="height: 36px;">${info.currency}</span>
      <span style="margin-bottom: 12px;">${info.accountType}</span>
      <span style="margin-bottom: 12px;">${info.fromDate}</span>
      <span style="margin-bottom: 12px;">${info.toDate}</span>
      <span style="margin-bottom: 12px;">${info.printedDateTime}</span>
      <span style="margin-bottom: 4px;">1</span>
    </div>
    <div style="width: 25%; display: flex; flex-direction: column;">
      <span style="margin-bottom: 12px;">Account Title</span>
      <span style="height: 36px;">Customer Address</span>
      <span style="margin-bottom: 12px;">Customer Address</span>
      <span style="margin-bottom: 12px;">Old Number</span>
      <span style="margin-bottom: 12px;">IBAN Number</span>
      <span style="margin-bottom: 12px;">Bank Name</span>
      <span style="margin-bottom: 4px;">Branch Name</span>
    </div>
    <div style="width: 25%; display: flex; flex-direction: column;">
      <span style="margin-bottom: 12px;">${info.accountTitle}</span>
      <span style="height: 36px;">${info.address}</span>
      <span style="margin-bottom: 12px;">${info.address2}</span>
      <span style="margin-bottom: 12px;">${info.oldNumber}</span>
      <span style="margin-bottom: 12px;">${info.iban}</span>
      <span style="margin-bottom: 12px;">${info.bankName}</span>
      <span style="margin-bottom: 4px;">${info.branchName}</span>
    </div>
  </div>
`;

// ── Table column headers (page 1 only) ───────────────────────────────────────
const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH_STYLE} width: 24%;">Booking Date</th>
      <th style="${TH_STYLE} width: 11%;">Value Date</th>
      <th style="${TH_STYLE} width: 8%;">Reference</th>
      <th style="${TH_STYLE} width: 13%;">Description</th>
      <th style="${TH_STYLE} width: 11%;">Cheque.no</th>
      <th style="${TH_STYLE} width: 11%;">Debit</th>
      <th style="${TH_STYLE} width: 11%;">Credit</th>
      <th style="${TH_STYLE} width: 11%;">Closing Bal-ance</th>
    </tr>
  </thead>
`;

// ── Opening balance row ───────────────────────────────────────────────────────
const generateOpeningBalanceRow = (tx: TransactionRow) => `
  <tr>
    <td colspan="7" style="${TD_STYLE} padding-left: 100px;">Balance at Per<br/>iod Start</td>
    <td style="${TD_STYLE}">${formatNumber(tx.balance)}</td>
  </tr>
`;

// ── Closing balance row (computed from all transactions) ─────────────────────
const generateClosingBalanceRow = (
  totalDebit: string,
  totalCredit: string,
  lastBalance: string,
) => `
  <tr style="background-color: #f6f7ef;">
    <td colspan="5" style="${TD_STYLE} padding-left: 100px;">Balance at Per<br/>iod End</td>
    <td style="${TD_STYLE}">${totalDebit}</td>
    <td style="${TD_STYLE}">${totalCredit}</td>
    <td style="${TD_STYLE}">${lastBalance}</td>
  </tr>
`;

// ── Regular transaction row ───────────────────────────────────────────────────
const generateTransactionRow = (tx: TransactionRow, rowIndex: number) => {
  const bg = rowIndex % 2 === 1 ? "background-color: #f6f7ef;" : "";
  return `
  <tr style="${bg}">
    <td style="${TD_STYLE} width: 24%">${tx.date}</td>
    <td style="${TD_STYLE} width: 11%;">${tx.valueDate || ""}</td>
    <td style="${TD_STYLE} width: 8%;">${tx.instNo || ""}</td>
    <td style="${TD_STYLE} width: 13%;">${tx.particulars}</td>
    <td style="${TD_STYLE} width: 11%;">${tx.docNo || ""}</td>
    <td style="${TD_STYLE} width: 11%;">${tx.debit ? formatNumber(tx.debit) : ""}</td>
    <td style="${TD_STYLE} width: 11%;">${tx.credit ? formatNumber(tx.credit) : ""}</td>
    <td style="${TD_STYLE} width: 11%;">${formatNumber(tx.balance)}</td>
  </tr>
  `;
};

// ── Footer (page number) — every page at bottom ──────────────────────────────
const generateFooter = (pageNum: number, totalPages: number) => `
<div style="padding: 30pt 0 35pt 0;">
<div style="height: 1.5px; background-color: #000;" />
<div style="padding-top: 6px; display: flex; justify-content: flex-end; ${FONT_PRIMARY} font-size: 7pt;">
    Page ${pageNum} of ${totalPages}
  </div>
  </div>
`;

// ── Main Layout ───────────────────────────────────────────────────────────────
export const generateSonehriHTML = (
  transactions: TransactionRow[],
  info: SonehriAccountInfo,
): string => {
  const openingRow = transactions.find((tx) => tx.isOpeningBalance) ?? null;

  // Compute closing balance row values from regular transaction rows
  const regularTxns = transactions.filter((tx) => !tx.isOpeningBalance);
  const totalDebit = regularTxns.reduce(
    (sum, tx) => sum + (parseFloat(tx.debit.replace(/,/g, "")) || 0),
    0,
  );
  const totalCredit = regularTxns.reduce(
    (sum, tx) => sum + (parseFloat(tx.credit.replace(/,/g, "")) || 0),
    0,
  );
  const lastBalance = regularTxns.length > 0
    ? regularTxns[regularTxns.length - 1].balance
    : "";

  const pages = paginateTransactions(transactions);
  const totalPages = pages.length;

  const pagesHtml = pages.map((pageTxns, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage  = pageIndex === totalPages - 1;
    const pageNum     = pageIndex + 1;

    const openingHtml = isFirstPage && openingRow
      ? generateOpeningBalanceRow(openingRow)
      : "";
    const closingHtml = isLastPage
      ? generateClosingBalanceRow(
          formatNumber(String(totalDebit)),
          formatNumber(String(totalCredit)),
          formatNumber(lastBalance),
        )
      : "";

    return `
      <div style="padding: 0 ${isFirstPage ? "36px" : "0"}; page-break-before: ${isFirstPage ? "auto" : "always"};">
        ${generatePageHeader(info)}
        ${isFirstPage ? generateAccountInfo(info) : ""}
        <div>
          <table style="width: 100%; border-collapse: collapse;" cellspacing="0">
            ${isFirstPage ? generateTableHeader() : ""}
            <tbody>
              ${openingHtml}
              ${pageTxns.map((tx, i) => generateTransactionRow(tx, i)).join("")}
              ${closingHtml}
            </tbody>
          </table>
        </div>
        ${generateFooter(pageNum, totalPages)}
      </div>
    `;
  });

  const styles = `
    @page { margin: 0; size: A4; }
    @media print {
      body { margin: 0; padding: 0; }
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
        <title>Sonehri Bank Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width: 100%; max-width: 800px; margin: auto;">
          ${pagesHtml.join("")}
        </div>
      </body>
    </html>
  `;
};
