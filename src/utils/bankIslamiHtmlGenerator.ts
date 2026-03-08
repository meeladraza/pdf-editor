import { TransactionRow, BankIslamiAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";
const FONT2 = "font-family: 'Times New Roman', serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX  = 1123;
const P1_TOP_PX     = 310;  // logo + title + issuing branch + account box + opening balance + separator
const REST_TOP_PX   = 30;   // non-first pages: no header, just 30px top padding
const TBL_HDR_PX    = 28;
const FOOTER_PX     = 30;
const SUMMARY_PX    = 110;  // debit/credit counts + closing + available balance rows

const AVAIL_P1        = A4_HEIGHT_PX - P1_TOP_PX   - TBL_HDR_PX - FOOTER_PX;
const AVAIL_REST      = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - FOOTER_PX;
const AVAIL_LAST_ONLY = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - SUMMARY_PX - FOOTER_PX;
const AVAIL_P1_LAST   = A4_HEIGHT_PX - P1_TOP_PX    - TBL_HDR_PX - SUMMARY_PX - FOOTER_PX;

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size:8pt; font-weight:bold;;
            padding: 2px; border:1px solid #888; text-align:center; vertical-align:middle; color:#000;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width:11%;">Date</th>
      <th style="${TH} width:46%;">Description</th>
      <th style="${TH} width:15%;">Withdrawal</th>
      <th style="${TH} width:13%;">Deposit</th>
      <th style="${TH} width:15%;">Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD     = `${FONT} font-size:8pt; padding:2px 0px 4px 0px; vertical-align:top; color:#000; line-height:1.3;`;
const TD_NUM = `${TD} text-align:right;`;

const generateRow = (tx: TransactionRow) => `
  <tr>
    <td style="${TD} text-align:center;">${tx.date}</td>
    <td style="${TD}">${tx.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD_NUM}">${tx.debit || ""}</td>
    <td style="${TD_NUM}">${tx.credit || ""}</td>
    <td style="${TD_NUM}">${tx.balance || ""}</td>
  </tr>`;

// ── DOM-based row height measurement ─────────────────────────────────────────
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  const container = document.createElement("div");
  container.style.cssText =
    "position:absolute; top:-9999px; left:-9999px; width:720px; visibility:hidden;";
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

// ── Page header ───────────────────────────────────────────────────────────────
const generateHeader = (info: BankIslamiAccountInfo, isFirstPage: boolean) => `
  <div style="padding:30px 20px 0 8px;">

    <!-- BankIslami logo (top right) -->
    <div style="${FONT2} padding: 10px 16px 5px 16px; display:flex; align-items:center; justify-content:flex-end; width: 100%; background:#1b3a6b; color:#fff; margin-bottom:4px; font-size:32pt; font-weight: bolder;">
        <span>BankIslami</span>
    </div>

    <!-- Title + Issuing Branch -->
    <div style="${FONT} margin-bottom:14px;">
      <div style="font-size:13pt; font-weight:bold; margin-bottom:4px;">Duplicate Statement Of Account</div>
      <div style="display:flex; align-items: center; gap:40px;">
        <div style="width: 63%; font-size:8.5pt;"><strong>Issuing Branch</strong> &nbsp;: &nbsp;${info.issuingBranch}</div>
        <div style="display:flex; align-items:center; width: 42%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>Issue Date</div> 
            <div style= "margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.issueDate}</div>
        </div>
      </div>
    </div>

    <!-- Account box (left) + Account details (right) -->
    <div style="display:flex; gap:40px; margin-bottom:14px; align-items:center; width: 100%">

      <!-- Left: bordered account box -->
      <div style="width: 55%; border:1px solid #000; padding:6px 4px; ${FONT} font-size:8.5pt; line-height:1.6;">
        <div style="font-weight:bold; font-size:10pt; margin-bottom:10px;">${info.accountName}</div>
        <div>${info.address1}</div>
        <div>${info.address2}</div>
        <div>${info.address3}</div>
        <div>${info.city}</div>
        <div>${info.phone1}</div>
        <div>${info.phone2}</div>
      </div>

      <!-- Right: key-value account info -->
      <div style="${FONT} width:45%; font-size:8.5pt; line-height:1.4; flex:1;">
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>Account Branch</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.accountBranch}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>Account Type</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.accountType}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>Currency</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.currency}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>Account No</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.accountNo}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>IBAN</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.iban}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt; margin-top: 8px;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>From Date</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.fromDate}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>To Date</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.toDate}</div>
        </div>
        <div style="display:flex; align-items:center; width: 100%; font-size: 8.5pt; margin-top: 8px;">
          <div style="display: flex; align-items:center; width:40%; font-size: 8.5pt; font-weight: bold;">
            <div>Opening Balance</div> 
            <div style="margin-left: auto;">:</div>
          </div>
          <div style="width: 60%; font-size: 8.5pt; text-align: right;">${info.openingBalance}</div>
        </div>
      </div>
    </div>
  </div>
`;

// ── Summary section (last page) ───────────────────────────────────────────────
const generateSummary = (
  info: BankIslamiAccountInfo,
  debitCount: number,
  creditCount: number,
  totalDebit: string,
  totalCredit: string,
  closingBalance: string,
) => `
  <div style="display: flex; flex-direction: column; align-items: center; ${FONT} font-size:8.5pt; padding:40px 20px 0 8px; color:#000; border-top: 1px solid #000;">
  <div>
    <div style="display:flex; gap:80px; margin-bottom:4px;">
      <div><strong>DEBIT TRANSACTIONS COUNT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;</strong>${debitCount}</div>
      <div><strong>TOTAL DEBIT AMOUNT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;</strong>${totalDebit}</div>
    </div>
    <div style="display:flex; gap:80px; margin-bottom:20px;">
      <div><strong>CREDIT TRANSACTIONS COUNT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>${creditCount}</div>
      <div><strong>TOTAL CREDIT AMOUNT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;</strong>${totalCredit}</div>
    </div>
    </div>
    <div>
    <div style="display:flex; gap:20px; margin-bottom:4px; font-weight:bold;">
      <div style="min-width:115px;">CLOSING BALANCE</div>
      <div>&nbsp;&nbsp;as on &nbsp;${info.toDate} &nbsp;&nbsp;${closingBalance}</div>
    </div>
    <div style="display:flex; gap:20px; font-weight:bold;">
      <div style="min-width:115px;">AVAILABLE BALANCE</div>
      <div>as on &nbsp;${info.toDate} &nbsp;&nbsp;${closingBalance}</div>
    </div>
    </div>
  </div>
`;

// ── Footer ────────────────────────────────────────────────────────────────────
const generateFooter = (pageNum: number, totalPages: number, printedBy: string) => `
  <div style="display:flex; justify-content:space-between; align-items:center;
              padding:10px 60px 20px 8px; ${FONT} color:#000; flex-shrink:0;">
    <span style="font-size:8pt;">Printed By : &nbsp;${printedBy}</span>
    <span style="font-size:8.5pt; font-weight: bold;">Page ${pageNum} of ${totalPages}</span>
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateBankIslamiHTML = async (
  transactions: TransactionRow[],
  info: BankIslamiAccountInfo,
): Promise<string> => {
  const measuredHeights = measureRowHeights(transactions);
  const txPages    = paginateByMeasuredHeight(transactions, measuredHeights);
  const totalPages = txPages.length;

  // ── Computed summary values ──────────────────────────────────────────────────
  const parseAmt = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
  const fmtAmt   = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const debitCount    = transactions.filter((t) => t.debit).length;
  const creditCount   = transactions.filter((t) => t.credit).length;
  const totalDebit    = fmtAmt(transactions.reduce((s, t) => s + parseAmt(t.debit),  0));
  const totalCredit   = fmtAmt(transactions.reduce((s, t) => s + parseAmt(t.credit), 0));
  const lastTx        = transactions[transactions.length - 1];
  const closingBalance = lastTx?.balance ?? "";

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${isFirstPage ? generateHeader(info, true) : ""}
        <div style="padding:${isFirstPage ? "0" : "30px"} 20px 4px 8px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
            </tbody>
          </table>
        </div>
        ${isLastPage ? generateSummary(info, debitCount, creditCount, totalDebit, totalCredit, closingBalance) : ""}
        <div style="flex:1;"></div>
        <div style="flex-shrink:0;">
          ${generateFooter(pageNum, totalPages, info.printedBy)}
        </div>
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
        <title>Bank Islami Statement</title>
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
