import { TransactionRow, DubaiIslamicAccountInfo } from "../types";
import { formatNumber } from "./faisalExcelParser";

// ── Palette ───────────────────────────────────────────────────────────────────────────────
const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ────────────────────────────────────────────────────────────
const A4_HEIGHT_PX   = 1123;
const HEADER_PX      = 280; // top padding + account info block (page 1 only, with buffer)
const TBL_HEADER_PX  = 38;  // column header row
const FOOTER_ROW_PX  = 26;  // totals footer row (last page only)
const PAGE_NUM_PX    = 28;  // page number line
const ROW_HEIGHT_PX  = 26;  // row height with buffer

// Page 1: header + table header + rows + footer row + page num
const ROWS_PX_P1   = A4_HEIGHT_PX - HEADER_PX - TBL_HEADER_PX - FOOTER_ROW_PX - PAGE_NUM_PX;
// Page 2+: table header + rows + page num
const ROWS_PX_REST = A4_HEIGHT_PX - TBL_HEADER_PX - PAGE_NUM_PX;

// ── Pagination ────────────────────────────────────────────────────────────────────────
const paginateTransactions = (rows: TransactionRow[]): TransactionRow[][] => {
  const pages: TransactionRow[][] = [];
  let current: TransactionRow[] = [];
  let usedPx = 0;
  let firstPage = true;

  for (const tx of rows) {
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

// ── Account info (page 1 only) ────────────────────────────────────────────────────
const generateAccountInfo = (
  info: DubaiIslamicAccountInfo,
  lastBalance: string,
) => {
  const LABEL = `${FONT} font-size: 8pt; font-weight: bold; padding: 3px 2px 1px 0; white-space: nowrap;`;
  const VALUE = `${FONT} font-size: 8pt; font-weight: bold; padding: 3px 8px 1px 0;`;

  return `
    <div style="padding: 80px 36px 16px 36px;">
      <div style="display: flex; gap: 40px;">

        <!-- Left column -->
        <div style="flex: 1;">
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="${LABEL} width:35%;">STATEMENT PERIOD:</td>
                <td style="${VALUE} width:65%;">${info.fromPeriod} To ${info.toPeriod}</td>
              </tr>
              <tr>
                <td style="${LABEL} width:35%;">CURENCY:</td>
                <td style="${VALUE} width:65%;">${info.currency}</td>
              </tr>
              <tr>
                <td style="${LABEL} width:35%;">ADDRESS:</td>
                <td style="${VALUE} width:65%;; white-space: pre-line;">${info.address}</td>
              </tr>
              <tr>
                <td style="${LABEL} width:35%;">ACCOUNT TITLE:</td>
                <td style="${VALUE} width:65%;">${info.accountTitle}</td>
              </tr>
              <tr>
                <td style="${LABEL} width:35%;">TYPE:</td>
                <td style="${VALUE} width:65%;">${info.accountType}</td>
              </tr>
              <tr>
                <td style="${LABEL} width:35%;">AVAIL. BALANCE:</td>
                <td style="${VALUE} width:65%;">${lastBalance}</td>
              </tr>
              <tr>
                <td style="${LABEL} width:35%;">OPENING BAL:</td>
                <td style="${VALUE} width:65%;">${formatNumber(info.openingBal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Right column -->
        <div style="flex: 1;">
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="${LABEL}">A/C OPENING DATE:</td>
                <td style="${VALUE}">${info.acOpeningDate}</td>
              </tr>
              <tr>
                <td style="${LABEL}">ACCOUNT NO:</td>
                <td style="${VALUE}">${info.accountNo}</td>
              </tr>
              <tr>
                <td style="${LABEL}">IBAN A/C NO:</td>
                <td style="${VALUE}">${info.iban}</td>
              </tr>
              <tr>
                <td style="${LABEL}">BRANCH:</td>
                <td style="${VALUE}">${info.branch}</td>
              </tr>
              <tr>
                <td style="${LABEL}">&nbsp;</td>
                <td style="${VALUE}">&nbsp;</td>
              </tr>
              <tr>
                <td style="${LABEL}">CURRENT BALANCE:</td>
                <td style="${VALUE}">${lastBalance}</td>
              </tr>
              <tr>
                <td style="${LABEL}">RUN DATE:</td>
                <td style="${VALUE}">${info.runDate}</td>
              </tr>
              <tr>
                <td style="${LABEL}">CLOSING BAL:</td>
                <td style="${VALUE}">${lastBalance}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `;
};

// ── Table header ────────────────────────────────────────────────────────────────────────
const TH = `${FONT} font-size: 8pt; font-weight: bold; border: 1px solid #000; background-color: #dedede; color: #000; text-align: center;`;
const TD = `${FONT} font-size: 8pt; border: 1px solid #000;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width: 13%;">Posting Date</th>
      <th style="${TH} width: 13%;">Instrument Number</th>
      <th style="${TH} width: 23%;">Transaction Details</th>
      <th style="${TH} width: 11.5%;">Transaction Ref. No.</th>
      <th style="${TH} width: 15.5%; text-align: right;">Debit</th>
      <th style="${TH} width: 12%; text-align: right;">Credit</th>
      <th style="${TH} width: 12%; text-align: right;">Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────────────────
const generateTransactionRow = (tx: TransactionRow) => `
  <tr>
    <td style="${TD} text-align: center;">${tx.date}</td>
    <td style="${TD}">${tx.instNo || ""}</td>
    <td style="${TD}">${tx.particulars}</td>
    <td style="${TD}">${tx.docNo || ""}</td>
    <td style="${TD} text-align: right;">${tx.debit ? formatNumber(tx.debit) : ""}</td>
    <td style="${TD} text-align: right;">${tx.credit ? formatNumber(tx.credit) : ""}</td>
    <td style="${TD} text-align: right;">${formatNumber(tx.balance)}</td>
  </tr>
`;

// ── Footer row (last page) — totals ───────────────────────────────────────────────
const generateFooterRow = (totalDebit: string, totalCredit: string) => `
  <tr>
    <td style="${TD}"></td>
    <td style="${TD}"></td>
    <td style="${TD}"></td>
    <td style="${TD} text-align: right; font-weight: bold;">Total</td>
    <td style="${TD} text-align: right; font-weight: bold;">${totalDebit}</td>
    <td style="${TD} text-align: right; font-weight: bold;">${totalCredit}</td>
    <td style="${TD}"></td>
  </tr>
`;

// ── Page number ───────────────────────────────────────────────────────────────────────
const generatePageNumber = (pageNum: number, totalPages: number) => `
  <div style="padding: 4px 36px 10px 36px; text-align: right; ${FONT} font-size: 8pt;">
    Page ${pageNum} of ${totalPages}
  </div>
`;

// ── Main ──────────────────────────────────────────────────────────────────────────────
export const generateDubaiHTML = (
  transactions: TransactionRow[],
  info: DubaiIslamicAccountInfo,
): string => {
  const totalDebit = transactions.reduce(
    (sum, tx) => sum + (parseFloat(tx.debit.replace(/,/g, "")) || 0),
    0,
  );
  const totalCredit = transactions.reduce(
    (sum, tx) => sum + (parseFloat(tx.credit.replace(/,/g, "")) || 0),
    0,
  );
  const lastBalance = transactions.length > 0
    ? formatNumber(transactions[transactions.length - 1].balance)
    : "0.00";

  const pages = paginateTransactions(transactions);
  const totalPages = pages.length;

  const pagesHtml = pages.map((pageTxns, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage  = pageIndex === totalPages - 1;
    const pageNum     = pageIndex + 1;

    const footerRowHtml = isLastPage
      ? generateFooterRow(
          formatNumber(String(totalDebit)),
          formatNumber(String(totalCredit)),
        )
      : "";

    return `
      <div style="page-break-before: ${isFirstPage ? "auto" : "always"};">
        ${isFirstPage ? generateAccountInfo(info, lastBalance) : ""}
        <div style="padding: ${isFirstPage ? "0" : "36px"} 36px 0 36px;">
          <table style="width: 100%; border-collapse: collapse;" cellspacing="0">
            ${generateTableHeader()}
            <tbody>
              ${pageTxns.map((tx) => generateTransactionRow(tx)).join("")}
              ${footerRowHtml}
            </tbody>
          </table>
        </div>
        ${generatePageNumber(pageNum, totalPages)}
      </div>
    `;
  });

  const styles = `
    @page { margin: 0; size: A4; }
    @media print { body { margin: 0; padding: 0; } tr { page-break-inside: avoid; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; }
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Dubai Islamic Bank Statement</title>
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