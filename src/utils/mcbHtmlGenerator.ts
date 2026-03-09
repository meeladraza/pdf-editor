import { TransactionRow, MCBAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX  = 1123;
const P1_TOP_PX     = 258;  // logo+info+branch+opening balance+NOTE on p1
const REST_TOP_PX   = 52;   // minimal header on non-first pages
const TBL_HDR_PX    = 36;   // 11-column header row
const SUMMARY_PX    = 88;   // summary section (4 left rows + 2 right rows)
const FOOTER_PX     = 22;   // NOTE + page number

const AVAIL_P1        = A4_HEIGHT_PX - P1_TOP_PX   - TBL_HDR_PX - FOOTER_PX;
const AVAIL_REST      = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - FOOTER_PX;
const AVAIL_LAST_ONLY = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - SUMMARY_PX - FOOTER_PX;
const AVAIL_P1_LAST   = A4_HEIGHT_PX - P1_TOP_PX    - TBL_HDR_PX - SUMMARY_PX - FOOTER_PX;

// ── Table column header ───────────────────────────────────────────────────────
const TH = `${FONT} font-size:7pt; padding-bottom:4px;
            border-top:1px solid #000; border-bottom: 1px solid #000; font-weight: normal; background:#f2f2f2; color:#000;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width:7%; text-align:right; border-left: 1px solid #000;">Tran. Date</th>
      <th style="${TH} width:7%; text-align:center;">Effect Date</th>
      <th style="${TH} width:4%; text-align: center;">Tran. Br.</th>
      <th style="${TH} width:20%; text-align:center">Transaction Details</th>
      <th style="${TH} width:9%;">Remitter Name</th>
      <th style="${TH} width:12%;">Remitter IBAN</th>
      <th style="${TH} width:8%;">Remitter Bank</th>
      <th style="${TH} width:8%;">Chq / Ref No</th>
      <th style="${TH} width:8%; text-align: right;">Debit</th>
      <th style="${TH} width:8%; text-align:right;">Credit</th>
      <th style="${TH} width:9%; text-align:right; padding-right: 2px; border-right: 1px solid #000;">Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD     = `${FONT} font-size:7pt; vertical-align:top; color:#000; line-height:1.3; border-bottom:1px solid #000;`;
const TD_NUM = `${TD} text-align:right;`;

const generateRow = (tx: TransactionRow) => `
  <tr>
    <td style="${TD} text-align:center; border-left: 1px solid #000;">${tx.date}</td>
    <td style="${TD} text-align:center;">${tx.valueDate || ""}</td>
    <td style="${TD} text-align:center;">${tx.tranBranch || ""}</td>
    <td style="${TD}">${tx.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD}">${tx.narrative || ""}</td>
    <td style="${TD}">${tx.extReference || ""}</td>
    <td style="${TD}">${tx.docNo || ""}</td>
    <td style="${TD} text-align:center;">${tx.instNo || ""}</td>
    <td style="${TD_NUM}">${tx.debit || ""}</td>
    <td style="${TD_NUM}">${tx.credit || ""}</td>
    <td style="${TD_NUM} padding-right: 2px; border-right: 1px solid #000;">${tx.balance || ""}</td>
  </tr>`;

// ── DOM-based row height measurement ─────────────────────────────────────────
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  const container = document.createElement("div");
  container.style.cssText =
    "position:absolute; top:-9999px; left:-9999px; width:752px; visibility:hidden;";
  container.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
      ${generateTableHeader()}
      <tbody>${rows.map(generateRow).join("")}</tbody>
    </table>`;
  document.body.appendChild(container);
  const trs = container.querySelectorAll("tbody tr");
  const heights = Array.from(trs).map((tr) => tr.getBoundingClientRect().height);
  document.body.removeChild(container);
  return heights;
};

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateByMeasuredHeight = (
  rows: TransactionRow[],
  heights: number[],
): TransactionRow[][] => {
  const pages: TransactionRow[][] = [];
  const remaining  = rows.slice();
  const remHeights = heights.slice();
  let firstPage    = true;

  const fillPage = (limit: number): TransactionRow[] => {
    const page: TransactionRow[] = [];
    let used = 0;
    while (remaining.length > 0 && used + remHeights[0] <= limit) {
      page.push(remaining.shift()!);
      used += remHeights.shift()!;
    }
    if (page.length === 0 && remaining.length > 0) {
      page.push(remaining.shift()!);
      remHeights.shift();
    }
    return page;
  };

  while (remaining.length > 0) {
    const remTotal  = remHeights.reduce((s, h) => s + h, 0);
    const lastLimit = firstPage ? AVAIL_P1_LAST : AVAIL_LAST_ONLY;
    const midLimit  = firstPage ? AVAIL_P1      : AVAIL_REST;

    if (remTotal <= lastLimit) {
      pages.push(remaining.splice(0));
      break;
    }
    pages.push(fillPage(midLimit));
    firstPage = false;
  }

  if (pages.length === 0) pages.push([]);
  return pages;
};

// ── Full header (first page) ──────────────────────────────────────────────────
const generateFirstPageHeader = (info: MCBAccountInfo) => {
  const KV = `display:flex; gap:28px; margin-bottom:4px; ${FONT} font-size:7.5pt; color:#000;`;
  const LBL = `font-weight:bold; min-width:140px; text-align:right;`;

  return `
  <div style="padding:4px 16px 0 16px;">

    <!-- Row 1: Logo + "Account Statement" -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2px;">
      <div style="display:flex; align-items:flex-end; gap:4px;">
        <img src="/mcb-logo.png" alt="MCB" style="height:55px;" />
        <span style="${FONT} font-size:9pt; font-weight:bold; color:#000; padding-bottom: 4px;">MCB Bank Limited</span>
      </div>
      <div style="${FONT} font-size:9pt; font-weight:bold; color:#000; padding-top: 6px">Account Statement</div>
    </div>

    <div style="font-size: 6pt; font-weight: bold; line-height: 1.4;">${info.accountTitle}</div>

    <!-- Two-column: address (left) | account details (right) -->
    <div style="display:flex; align-items: flex-start; justify-content: space-between; margin-bottom:8px;">

      <!-- Left: account title + address -->
      <div style=" ${FONT} font-size:7.5pt; color:#000; line-height:1.4; font-weight: bold; padding-top: 20px;">
        <div>${info.address} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NORTH KARACHI</div>
        <div>INDUSTRIAL AREA &nbsp;&nbsp;&nbsp; \KARACHI 0311-8266060</div>
      </div>

      <!-- Right: key-value pairs -->
      <div style="${FONT} font-size:7.5pt; color:#000;">
        <div style="${KV}"><span style="${LBL}">Account No:</span><span style="font-weight: bold;">${info.accountNo}</span></div>
        <div style="${KV}"><span style="${LBL}">IBAN:</span><span style="font-weight: bold;">${info.iban}</span></div>
        <div style="${KV}"><span style="${LBL}">Account Type / CCY:&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="font-weight: bold;">${info.accountType} &nbsp;/&nbsp; ${info.currency}</span></div>
        <div style="${KV}"><span style="${LBL}">Date of Account Open:</span><span style="font-weight: bold;">${info.accountOpenDate}</span></div>
        <div style="${KV}"><span style="${LBL}">Statement Period: &nbsp;From Date:</span><span>${info.fromDate} &nbsp;<strong>To Date</strong> ${info.toDate}</span></div>
        <div style="${KV}"><span style="${LBL}">Statement Date &amp; Time:</span><span>${info.statementDateTime}</span></div>
      </div>
    </div>

    <!-- Branch info (full width) -->
    <div style="${FONT} font-size:8pt; font-weight:bold; color:#000; margin-bottom:4px; padding-bottom:12px; border-bottom:1px solid #000;">
      ${info.branchInfo}
    </div>

    <!-- Opening balance -->
    <div style="display:flex; justify-content:flex-end; align-items:center; gap:20px;
                padding:0 0 4px 0; ${FONT} font-weight:bold; font-size:7.5pt; color:#000; margin-bottom:4px;">
      <span>Opening Balance</span>
      <div style="text-align:right; line-height:1.7;">
        <div style="display: flex; align-items: center;"><span style="min-width: 120px; text-align:left;">Ledger:</span> &nbsp;&nbsp;&nbsp; ${info.openingBalance}</div>
        <div style="display: flex; align-items: center;"><span style="min-width: 120px; text-align:left;">Actual:</span> &nbsp;&nbsp;&nbsp;&nbsp; ${info.openingBalance}</div>
      </div>
    </div>
   
  </div>
`;
};

// ── Minimal header (non-first pages) ─────────────────────────────────────────
const generateRestHeader = (info: MCBAccountInfo) => `
  <div style="display:flex; justify-content:space-between; align-items:center;
              padding:14px 16px 8px 16px; border-bottom:1px solid #ccc;">
    <div style="display:flex; align-items:center; gap:8px;">
      <img src="/mcb-logo.png" alt="MCB" style="height:28px;" />
      <span style="${FONT} font-size:9pt; font-weight:bold;">MCB Bank Limited</span>
    </div>
    <div style="${FONT} font-size:10pt; font-weight:bold;">Account Statement</div>
    <div style="${FONT} font-size:7.5pt; color:#444;">${info.accountTitle} &nbsp;|&nbsp; ${info.accountNo}</div>
  </div>
`;

// ── Summary section (last page) ───────────────────────────────────────────────
const generateSummary = (
  debitCount: number,
  creditCount: number,
  totalDebit: string,
  totalCredit: string,
  closingBalance: string,
) => {
  const CELL = `${FONT} font-size:7.5pt; color:#000; padding:4px 8px; border:1px solid #000;`;
  const CELL_BOLD = `${CELL} font-weight:bold;`;

  return `
    <div style="display:flex; margin-top:0; ${FONT}">
      <!-- Left: DR/CR counts and sums -->
      <table style="border-collapse:collapse; width:55%;">
        <tr>
          <td style="${CELL} width:60%;">Total DR Transactions</td>
          <td style="${CELL} width:40%; text-align:right;">${debitCount}</td>
        </tr>
        <tr>
          <td style="${CELL}">Total CR Transactions</td>
          <td style="${CELL} text-align:right;">${creditCount}</td>
        </tr>
        <tr>
          <td style="${CELL}">Sum of DR Transactions</td>
          <td style="${CELL} text-align:right;">${totalDebit}</td>
        </tr>
        <tr>
          <td style="${CELL}">Sum of CR Transactions</td>
          <td style="${CELL} text-align:right;">${totalCredit}</td>
        </tr>
      </table>
      <!-- Right: available and closing balance -->
      <table style="border-collapse:collapse; width:45%; margin-left:auto;">
        <tr>
          <td style="${CELL} width:55%;">Available Balance:</td>
          <td style="${CELL_BOLD} width:45%; text-align:right;">${closingBalance}</td>
        </tr>
        <tr>
          <td style="${CELL}">Closing Ledger Balance</td>
          <td style="${CELL_BOLD} text-align:right;">${closingBalance}</td>
        </tr>
      </table>
    </div>
  `;
};

// ── Footer ────────────────────────────────────────────────────────────────────
const generateFooter = (pageNum: number, totalPages: number) => `
  <div style="display:flex; justify-content:space-between; align-items:center;
              padding:4px 16px 6px 16px; ${FONT} font-size:6pt; color:#000; flex-shrink:0;">
    <span>NOTE: Impact of Outward Clearing Transactions (CHEQUE CLEARING CREDIT) will be reflected in the account balance once the instrument has been realized</span>
    <span style="font-weight:bold; white-space:nowrap; margin-left:8px;">Page: ${pageNum} of ${totalPages}</span>
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateMCBHTML = async (
  transactions: TransactionRow[],
  info: MCBAccountInfo,
): Promise<string> => {
  const measuredHeights = measureRowHeights(transactions);
  const txPages    = paginateByMeasuredHeight(transactions, measuredHeights);
  const totalPages = txPages.length;

  // ── Auto-calculated summary values ──────────────────────────────────────────
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const fmtAmt   = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const debitCount     = transactions.filter((t) => t.debit).length;
  const creditCount    = transactions.filter((t) => t.credit).length;
  const totalDebit     = fmtAmt(transactions.reduce((s, t) => s + parseAmt(t.debit),  0));
  const totalCredit    = fmtAmt(transactions.reduce((s, t) => s + parseAmt(t.credit), 0));
  const lastTx         = transactions[transactions.length - 1];
  const closingBalance = lastTx?.balance ?? "";

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${isFirstPage ? generateFirstPageHeader(info) : generateRestHeader(info)}
        <div style="padding:0 16px 2px 16px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
            </tbody>
          </table>
        </div>
        ${isLastPage ? `<div style="padding:0 16px;">${generateSummary(debitCount, creditCount, totalDebit, totalCredit, closingBalance)}</div>` : ""}
        <div style="flex:1;"></div>
        ${generateFooter(pageNum, totalPages)}
      </div>`;
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
        <title>MCB Bank Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width:100%; max-width:800px; margin:auto;">
          ${pagesHtml.join("")}
        </div>
      </body>
    </html>
  `;
};
