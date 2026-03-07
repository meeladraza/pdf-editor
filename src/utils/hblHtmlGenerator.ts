import { TransactionRow, HBLAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX   = 1123;
const FOOTER_IMG_PX  = 390   // height of footer-logo.png (Important Notes section)
const ROW_HEIGHT_PX  = 20;    // fallback row height

// Page 1: logo+heading + branch/date row + account holder/info + slogan + table-header
const P1_TOP_PX      = 267;
const P1_TBL_HDR_PX  = 32;
// Pages 2+: logo + account-info rows + slogan + table-header
const REST_TOP_PX    = 220;
const REST_TBL_HDR_PX = 32;

const AVAIL_P1   = A4_HEIGHT_PX - P1_TOP_PX   - P1_TBL_HDR_PX   - FOOTER_IMG_PX;
const AVAIL_REST = A4_HEIGHT_PX - REST_TOP_PX  - REST_TBL_HDR_PX - FOOTER_IMG_PX;

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
    <td style="${TD_NUM} ${bold}">${tx.debit || ""}</td>
    <td style="${TD_NUM} ${bold}">${tx.credit || ""}</td>
    <td style="${TD_NUM} ${bold}">${tx.balance ? `${tx.balance}CR` : ""}</td>
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
  let current: TransactionRow[] = [];
  let usedPx    = 0;
  let firstPage = true;

  rows.forEach((row, i) => {
    const limit = firstPage ? AVAIL_P1 : AVAIL_REST;
    const rowH  = heights[i] ?? ROW_HEIGHT_PX;
    if (usedPx + rowH > limit && current.length > 0) {
      pages.push(current);
      current   = [];
      usedPx    = 0;
      firstPage = false;
    }
    current.push(row);
    usedPx += rowH;
  });

  if (current.length > 0) pages.push(current);
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
      <div style="display:flex; font-weight:bold;"><span style="width:100px;">Date :</span><span>${info.date}</span></div>
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
          <span>${info.date}</span>
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
    const pageNum     = idx + 1;
    const header = isFirstPage
      ? generatePage1Header(info, pageNum, totalPages)
      : generateRestHeader(info, pageNum, totalPages);

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${header}
        <div style="flex:1; min-height:0; overflow:hidden; padding:0 30px 20px 16px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
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
