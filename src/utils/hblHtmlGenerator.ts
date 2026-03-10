import { TransactionRow, HBLAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX    = 1123;
const FOOTER_IMG_PX   = 390;  // footer image + padding
const ROW_HEIGHT_PX   = 20;   // fallback row height
const CARRIED_FWD_PX  = 20;   // "CARRIED FORWARD" row added to every page
const END_STMT_PX     = 20;   // "** End of Statement **" row added to last page only

// Page 1: logo+heading + branch/date row + account holder/info + slogan + table-header
const P1_TOP_PX       = 267;
const P1_TBL_HDR_PX   = 32;
// Pages 2+: logo + account-info rows + slogan + table-header
const REST_TOP_PX     = 220;
const REST_TBL_HDR_PX = 32;

const AVAIL_P1        = A4_HEIGHT_PX - P1_TOP_PX   - P1_TBL_HDR_PX   - FOOTER_IMG_PX - CARRIED_FWD_PX;
const AVAIL_REST      = A4_HEIGHT_PX - REST_TOP_PX  - REST_TBL_HDR_PX - FOOTER_IMG_PX - CARRIED_FWD_PX;
const AVAIL_P1_LAST   = AVAIL_P1   - END_STMT_PX;
const AVAIL_REST_LAST = AVAIL_REST - END_STMT_PX;

// ── Helpers ───────────────────────────────────────────────────────────────────
const MON_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt2dec = (val: string): string => {
  if (!val) return "";
  const n = parseFloat(val.replace(/,/g, ""));
  if (isNaN(n)) return val;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtDate = (date: string): string => {
  if (!date) return date;
  const s = date.trim();
  if (/^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(s)) return s;
  const sp = s.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (sp) return `${sp[1].padStart(2, "0")}-${sp[2]}-${sp[3]}`;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) { const m = parseInt(iso[2]) - 1; if (m >= 0 && m <= 11) return `${iso[3]}-${MON_SHORT[m]}-${iso[1]}`; }
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) { const m = parseInt(dmy[2]) - 1; if (m >= 0 && m <= 11) return `${dmy[1].padStart(2,"0")}-${MON_SHORT[m]}-${dmy[3]}`; }
  return s;
};

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size: 8pt; font-weight: bold; background: #d3d3d3; padding: 8px 6px 2px 6px; border: 2px solid #000; text-align: center; color: #000;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width: 12%;">Date</th>
      <th style="${TH} width: 40%;">Description</th>
      <th style="${TH} width: 15%;">Debit</th>
      <th style="${TH} width: 15%;">Credit</th>
      <th style="${TH} width: 18%;">Current Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD     = `${FONT} font-size: 8pt; padding: 0px 8px; border-right: 2px solid #000; border-left: 2px solid #000; vertical-align: top; color: #000; line-height: 1.5;`;
const TD_NUM = `${TD} text-align: right;`;

const generateRow = (tx: TransactionRow) => {
  const isBold = tx.isOpeningBalance || tx.isClosingBalance;
  const bold   = isBold ? "font-weight: bold;" : "";
  return `
  <tr>
    <td style="${TD} ${bold}">${tx.date}</td>
    <td style="${TD} ${bold}">${tx.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD_NUM} ${bold}">${fmt2dec(tx.debit)}</td>
    <td style="${TD_NUM} ${bold}">${fmt2dec(tx.credit)}</td>
    <td style="${TD_NUM} ${bold}">${tx.balance ? `${fmt2dec(tx.balance)}CR` : ""}</td>
  </tr>`;
};

// ── DOM-based row height measurement ─────────────────────────────────────────
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  const container = document.createElement("div");
  container.style.cssText =
    "position:absolute; top:-9999px; left:-9999px; width:768px; visibility:hidden;";
  container.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
      ${generateTableHeader()}
      <tbody>
        ${rows.map(generateRow).join("")}
      </tbody>
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
    while (remaining.length > 0 && used + (remHeights[0] ?? ROW_HEIGHT_PX) <= limit) {
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
    const lastLimit = firstPage ? AVAIL_P1_LAST : AVAIL_REST_LAST;
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

// ── Page 1 header ─────────────────────────────────────────────────────────────
const generatePage1Header = (
  info: HBLAccountInfo,
  pageNum: number,
  totalPages: number,
) => `
  <div style="padding: 28px 28px 0 16px;">
    <!-- Logo row + "Statement of Account" -->
    <div style="display:flex; align-items:center; margin-bottom:10px;">
      <img src="/hbl-logo.png" alt="HBL" style="height:70px; width:auto;" />
      <div style="${FONT} margin-left: 85px; padding-top: 6px; color: #2f948e; font-size: 14pt; font-weight:bold;">
        Statement of Account
      </div>
    </div>
    
    <!-- Branch + Date/Page row -->
    <div style="${FONT} font-size:8pt; margin-bottom:8px; margin-top: 32px;">
      <div style="font-weight:bold;">${info.branchName}</div>
    </div>
    <!-- Account holder (left) + Account info (right) -->
    <div style="display:flex; align-items: flex-end; justify-content:space-between; ${FONT} font-size:8pt; margin-bottom:28px;">
      <div>
        <div style="font-weight:bold; margin-bottom: 3px;">${info.accountHolderName}</div>
        <div style="font-weight:bold; margin-bottom: 3px;">${info.address1}</div>
        <div style="font-weight:bold; margin-bottom: 3px;">${info.address2}</div>
        <div style="font-weight:bold;">${info.address3}</div>
      </div>
      <div style="min-width:310px;">
      <div style="display:flex; font-weight:bold;"><span style="width:100px;">Date :</span><span>${fmtDate(info.date)}</span></div>
        <div style="display:flex; font-weight:bold; margin-top:4px;"><span style="width:100px;">Page No:</span><span>Page ${pageNum} of ${totalPages}</span></div>
        <div style="display:flex; font-weight:bold; margin-top:4px;"><span style="width:100px;">Account Type:</span><span>${info.accountType}</span></div>
        <div style="display:flex; font-weight:bold; margin-top:4px;"><span style="width:100px;">Account No.:</span><span>${info.accountNo}</span></div>
        <div style="display:flex; font-weight:bold; margin-top:4px;"><span style="width:100px;">Currency:</span><span>${info.currency}</span></div>
        <div style="display:flex; font-weight:bold; margin-top:4px;"><span style="width:100px;">IBAN:</span><span>${info.iban}</span></div>
      </div>
    </div>
    <!-- Slogan -->
    <div style="${FONT} font-size:8pt; font-weight: bold; text-align:center; margin-bottom:6px;">
      "Jahan Khwab, Wahan HBL"
    </div>
  </div>
`;

// ── Pages 2+ header ───────────────────────────────────────────────────────────
const generateRestHeader = (
  info: HBLAccountInfo,
  pageNum: number,
  totalPages: number,
) => `
  <div style="padding: 18px 28px 0 16px;">
    <!-- Logo -->
    <div style="margin-bottom:10px;">
      <img src="/hbl-logo.png" alt="HBL" style="height:70px; width:auto;" />
    </div>
    <!-- Account info rows -->
    <div style="width: 81%; display: flex; align-items: center; justify-content:space-between; ${FONT} font-size:8pt; font-weight: bold; margin-top: 32px; margin-bottom:20px;">
      <div style="display:flex; flex-direction:column; gap: 4px;">
        <div style="display:flex; align-items: center;">
          <span style="width: 115px;">Account No.:</span>
          <span>${info.accountNo}</span>
        </div>
        <div style="display:flex; align-items: center;">
          <span style="width: 115px;">Account Type:</span>
          <span>${info.accountType}</span>
        </div>
        <div style="display:flex; align-items: center;">
          <span style="width: 115px;">Currency:</span>
          <span>${info.currency}</span>
        </div>
      </div>
       <div style="display:flex; flex-direction:column; gap: 4px;">
        <div style="display:flex; align-items: center;">
          <span style="width: 90px;">Date:</span>
          <span>${fmtDate(info.date)}</span>
        </div>
        <div style="display:flex; align-items: center;">
          <span style="width: 90px;">Page No:</span>
          <span>Page ${pageNum} of ${totalPages}</span>
        </div>
      </div>
    </div>
   
    <!-- Slogan -->
    <div style="${FONT} font-size:8pt; font-weight: bold; text-align:center; margin-bottom:14px;">
      "Jahan Khwab, Wahan HBL"
    </div>
  </div>
`;

// ── Special rows ──────────────────────────────────────────────────────────────
const TD_SPEC = `${FONT} font-size: 8pt; padding: 0px 8px; border-right: 2px solid #000; border-left: 2px solid #000; vertical-align: top; color: #000; line-height: 1.5;`;

const generateCarriedForwardRow = (balance: string) => `
  <tr>
    <td style="${TD_SPEC}"></td>
    <td style="${TD_SPEC}">CARRIED FORWARD</td>
    <td style="${TD_SPEC} text-align:right;"></td>
    <td style="${TD_SPEC} text-align:right;"></td>
    <td style="${TD_SPEC} text-align:right;">${balance ? `${balance}CR` : ""}</td>
  </tr>`;

const generateEndOfStatementRow = () => `
  <tr>
    <td style="${TD_SPEC}"></td>
    <td style="${TD_SPEC} text-align:center;">** End of Statement **</td>
    <td style="${TD_SPEC} text-align:right;"></td>
    <td style="${TD_SPEC} text-align:right;"></td>
    <td style="${TD_SPEC} text-align:right;"></td>
  </tr>`;

const generateFillerRow = () => `
  <tr style="height:100%;">
    <td style="${TD_SPEC}"></td>
    <td style="${TD_SPEC}"></td>
    <td style="${TD_SPEC}"></td>
    <td style="${TD_SPEC}"></td>
    <td style="${TD_SPEC}"></td>
  </tr>`;

// ── Footer image ──────────────────────────────────────────────────────────────
const generateFooter = () => `
  <div style="padding: 0 30px 40px 16px; flex-shrink:0;">
    <img src="/hbl-footer.png" alt="Important Notes"
         style="width:100%; height:330px; object-fit:fill; display:block;" />
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateHBLHTML = async (
  transactions: TransactionRow[],
  info: HBLAccountInfo,
): Promise<string> => {
  const measuredHeights = measureRowHeights(transactions);
  const txPages   = paginateByMeasuredHeight(transactions, measuredHeights);
  const totalPages = txPages.length;

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;
    const header = isFirstPage
      ? generatePage1Header(info, pageNum, totalPages)
      : generateRestHeader(info, pageNum, totalPages);

    const lastBalance = rows[rows.length - 1]?.balance ?? "";

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${header}
        <div style="flex:1; min-height:0; padding:0 30px 0 16px; display:flex; flex-direction:column;">
          <table style="width:100%; border-collapse:collapse; flex:1; height:100%;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
              ${isLastPage ? generateCarriedForwardRow(lastBalance) : ""}
              ${isLastPage ? generateEndOfStatementRow() : ""}
              ${generateFillerRow()}
              ${!isLastPage ? generateCarriedForwardRow(lastBalance) : ""}
            </tbody>
          </table>
        </div>
        ${generateFooter()}
      </div>`;
  });

  const styles = `
    @page { margin: 0; size: A4; }
    @media print { body { margin: 0; padding: 0; } tr { page-break-inside: avoid; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; }
    tbody tr:last-child td { border-bottom: 2px solid #000; }
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>HBL Bank Statement</title>
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
