import { TransactionRow, JSBankAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX = 1123;
const P1_TOP_PX = 385; // full header with opening balance
const REST_TOP_PX = 350; // header without opening balance (~35px less)
const TBL_HDR_PX = 28;
const FOOTER_PX = 68;

const SUMMARY_PX = 60; // USER + Time Date section on last page
const TFOOT_PX   = 40; // CLOSING BALANCE + TOTAL rows in table footer

const AVAIL_P1        = A4_HEIGHT_PX - P1_TOP_PX   - TBL_HDR_PX - FOOTER_PX;
const AVAIL_REST      = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - FOOTER_PX;
const AVAIL_P1_LAST   = AVAIL_P1   - SUMMARY_PX - TFOOT_PX;
const AVAIL_REST_LAST = AVAIL_REST - SUMMARY_PX - TFOOT_PX;

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size: 7pt; font-weight: bold; background: #dedede; color: #000;
            padding: 4px 4px 8px 4px; border: 0; text-align: left; vertical-align: middle;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width:13%;">Post Date</th>
      <th style="${TH} width:12%;">Description</th>
      <th style="${TH} width:12%;">Cheque/Inst #</th>
      <th style="${TH} width:12%;">Value Date</th>
      <th style="${TH} width:13%;">Debit Amount</th>
      <th style="${TH} width:13%;">Credit Amount</th>
      <th style="${TH} width:13%;">Balance</th>
      <th style="${TH} width:12%;">Reference</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD = `${FONT} font-size: 7pt; padding: 4px 4px 8px 4px;; border: 0; vertical-align: top; color: #000; line-height: 1.3;`;
const TD_NUM = `${TD} text-align: right;`;

const generateRow = (tx: TransactionRow) => {
  return `
  <tr>
    <td style="${TD} text-align:left;">${tx.date}</td>
    <td style="${TD} word-break: break-all;">${tx.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD} text-align:left;">${tx.instNo || ""}</td>
    <td style="${TD} text-align:left;">${tx.valueDate || ""}</td>
    <td style="${TD_NUM}">${tx.debit || ""}</td>
    <td style="${TD_NUM}">${tx.credit || ""}</td>
    <td style="${TD_NUM}">${tx.balance || ""}</td>
    <td style="${TD} text-align:left;">${tx.extReference || ""}</td>
  </tr>`;
};

// ── DOM-based row height measurement ─────────────────────────────────────────
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  const container = document.createElement("div");
  // 694px = A4 width (794px) minus left+right padding (50px × 2)
  // Matches the actual table width inside the PDF renderer
  container.style.cssText =
    "position:absolute; top:-9999px; left:-9999px; width:694px; visibility:hidden;";
  container.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
      ${generateTableHeader()}
      <tbody>${rows.map(generateRow).join("")}</tbody>
    </table>`;
  document.body.appendChild(container);
  const trs = container.querySelectorAll("tbody tr");
  // Math.ceil + 1px safety buffer absorbs sub-pixel rendering differences
  const heights = Array.from(trs).map(
    (tr) => Math.ceil(tr.getBoundingClientRect().height) + 1,
  );
  document.body.removeChild(container);
  return heights;
};

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateByMeasuredHeight = (
  rows: TransactionRow[],
  heights: number[],
): TransactionRow[][] => {
  const pages: TransactionRow[][] = [];
  const remaining = rows.slice();
  const remHeights = heights.slice();
  let firstPage = true;

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
    const lastLimit = firstPage ? AVAIL_P1_LAST   : AVAIL_REST_LAST;
    const midLimit  = firstPage ? AVAIL_P1        : AVAIL_REST;

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

// ── Page header ───────────────────────────────────────────────────────────────
const generateHeader = (
  info: JSBankAccountInfo,
  showOpeningBalance: boolean,
) => {
  const ROW = `display:flex; align-items:center; ${FONT} font-size: 8pt; color: #000; margin-bottom: 10px;`;
  const LBL = `min-width: 150px;`;

  return `
  <div style="padding: 50px 40px 0px 50px;">

    <!-- Logo (left) + Date/Time (right) -->
    <div style="display:margin-bottom:10px;">
      <img src="/js-logo.png" alt="JS BANK" style="height:42px; width:auto;" />
      
    </div>

    <div style="display: flex; flex-direction: column; justify-content: flex-end; ${FONT} font-size: 7pt; font-weight:580; color: #000; text-align:right; line-height:1.4; margin-bottom: 10px;">
        <div>${info.statementDate}</div>
        <div>${info.statementTime}</div>
      </div>

   

    <!-- Title -->
    <div style="${FONT} font-size: 7pt; font-weight: 580; color: #000; margin-bottom: 28px;">
      ACCOUNT STATEMENT-INTERIM/DUPLICATE
    </div>

    <!-- Two-column: holder info (left) + account details (right) -->
    <div style="display:flex; align-items:center; gap: 60px; margin-bottom:6px;">

      <!-- Left: account holder info, pushed down to align with mid-right -->
      <div style="${FONT} font-size: 7pt; font-weight: 580; color: #000;">
        <div style="margin-bottom: 10px;">${info.accountName}</div>
        <div style="margin-bottom: 10px;">ATTN ${info.attnName}</div>
        <div style="margin-bottom: 10px;">${info.address1}</div>
        <div style="margin-bottom: 10px;">${info.address2}</div>
      </div>

      <!-- Right: account detail rows -->
      <div style="${FONT} font-size: 7pt; font-weight: 580; color: #000; flex: 1;">
        <div style="${ROW}"><span style="${LBL} width: 50%;">Account No :</span><span style="width:50%;">${info.accountNo}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">Old Account No :</span><span style="width:50%;">${info.oldAccountNo}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">IBAN No :</span><span style="width:50%;">${info.ibanNo}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">Account Type :</span><span style="width:50%;">${info.accountType}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">Currency :</span><span style="width:50%;">${info.currency}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">Start Date :</span><span style="width:50%;">${info.startDate}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">End Date :</span><span style="width:50%;">${info.endDate}</span></div>
        <div style="${ROW}"><span style="${LBL} width: 50%;">Joint Holders :</span><span style="width:50%;">${info.jointHolders}</span></div>
      </div>
    </div>

    <!-- Statement Date -->
    <div style="${FONT} font-size: 7pt; font-weight: 580; color: #000; margin-bottom: 10px;">
      <span style="display:inline-block; width: 50%;">Statement Date :</span>
      <span style="width:50%;">${info.statementDateLabel}</span>
    </div>

    ${
      showOpeningBalance
        ? `
    <!-- Opening Balance (first page only) -->
    <div style="${FONT} font-size: 7pt; font-weight: 580; color: #000; margin-bottom: 6px;">
      <span style="display:inline-block; width: 50%;">OPENING BALANCE :</span>
      <span style="width:50%;">${info.openingBalance}</span>
    </div>
    `
        : ""
    }

  </div>
`;
};

// ── Number helpers ────────────────────────────────────────────────────────────
const parseAmt = (s: string): number => {
  const n = Number(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmt2dec  = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTotal = (n: number): string => (n === 0 ? "-" : fmt2dec(n));

// ── Table footer (closing balance + totals, last page only) ───────────────────
const TF = `${FONT} font-size: 7pt; padding: 4px 4px 8px 4px; border: 0;
            vertical-align: top; color: #000; background: #f6f7ef;`;

const generateTableFooter = (
  closingBalance: string,
  totalDebit: string,
  totalCredit: string,
) => `
  <tfoot>
    <tr>
      <td style="${TF}"></td>
      <td style="${TF} word-break: break-all;">CLOSING BALANCE :</td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF} text-align:right;">${closingBalance}</td>
      <td style="${TF}"></td>
    </tr>
    <tr>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF}">TOTAL :</td>
      <td style="${TF}"></td>
      <td style="${TF} text-align:right;">${totalDebit}</td>
      <td style="${TF} text-align:right;">${totalCredit}</td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
    </tr>
  </tfoot>
`;

const generatePageSummary = (info: JSBankAccountInfo) => `
<div style="margin: 6px 50px 40px 50px; ${FONT} font-size: 7pt; font-weight: bold; color: #000; display: flex; flex-direction: column; gap: 12px;">
  <div style="display: flex; align-items: center;">
    <div style="width:50%">USER:</div>
    <div style="width:50%">${info.user}</div>
  </div>
  <div style="display: flex; align-items: center;">
    <div style="width:50%">Time Date:</div>
    <div style="width:50%">${info.timeDate}</div>
  </div>
</div>
`;

// ── Footer ────────────────────────────────────────────────────────────────────
const generateFooter = (
  pageNum: number,
  totalPages: number,
  info: JSBankAccountInfo,
) => `
  <div style="display:flex; justify-content: flex-end; margin: 0px 50px 20px 50px; ${FONT} font-size: 6.5pt; color: #000; flex-shrink:0; border-top: 1px solid #000; padding-top: 4px;">
    
      <div>Page ${pageNum} of ${totalPages}</div>
    </div>
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateJsBankHTML = async (
  transactions: TransactionRow[],
  info: JSBankAccountInfo,
): Promise<string> => {
  // Exclude closing-balance rows from tbody (they appear in tfoot instead)
  const regularTx = transactions.filter((tx) => !tx.isClosingBalance);

  // Closing balance = last regular row's balance
  const closingBalance = regularTx[regularTx.length - 1]?.balance ?? "";

  // Calculate totals across all regular rows
  const totalDebit  = fmtTotal(regularTx.reduce((s, tx) => s + parseAmt(tx.debit),  0));
  const totalCredit = fmtTotal(regularTx.reduce((s, tx) => s + parseAmt(tx.credit), 0));

  const measuredHeights = measureRowHeights(regularTx);
  const txPages = paginateByMeasuredHeight(regularTx, measuredHeights);
  const totalPages = txPages.length;

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${generateHeader(info, isFirstPage)}
        <div style="padding: 0 50px 4px 50px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
            </tbody>
            ${isLastPage ? generateTableFooter(closingBalance, totalDebit, totalCredit) : ""}
          </table>
        </div>
        ${isLastPage ? generatePageSummary(info) : ""}
        <div style="flex:1;"></div>
        ${generateFooter(pageNum, totalPages, info)}
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
        <title>JS Bank Statement</title>
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
