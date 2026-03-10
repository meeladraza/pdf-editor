import { TransactionRow, BankAlHabibAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

const ensureDMY = (dateStr: any): string => {
  if (!dateStr) return "";
  const s = String(dateStr).trim();
  // Already in DD/MM/YYYY?
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }

  // Handle DD-MON-YYYY (e.g. 20-OCT-2025)
  const monMatch = s.match(
    /^(\d{1,2})-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(\d{4})$/i,
  );
  if (monMatch) {
    const months: Record<string, string> = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dec: "12",
    };
    return `${monMatch[1].padStart(2, "0")}/${months[monMatch[2].toLowerCase()]}/${monMatch[3]}`;
  }

  // Standard JS parse
  const date = new Date(s);
  if (!isNaN(date.getTime())) {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  return s;
};

// ── Pagination constants ───────────────────────────────────────────────────────
const A4_HEIGHT_PX = 1123;
const HEADER_PX = 105; // logo + bank name + branch + address
const ACCT_INFO_PX = 125; // statement heading + from/to + account fields
const TBL_HEADER_PX = 32; // column header row
const PAGE_NUM_PX = 44; // page number div height
const PAGE_NUM_GAP = 20; // gap between last row and page number box
// Total bottom reserved: margin-top(6) + box + margin-bottom(28) + gap
const BOTTOM_RESERVED_PX = 6 + PAGE_NUM_PX + 28 + PAGE_NUM_GAP;

const ROW_HEIGHT_PX = 22;

const AVAIL_PX =
  A4_HEIGHT_PX - HEADER_PX - ACCT_INFO_PX - TBL_HEADER_PX - BOTTOM_RESERVED_PX;

// ── Pagination logic ──────────────────────────────────────────────────────────

/**
 * Measures actual row heights by rendering them into a hidden off-screen div.
 * This handles dynamic heights from wrapping text in the "Details" column.
 */
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  // Create off-screen container
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "768px"; // Standard A4 width for the PDF
  container.style.visibility = "hidden";

  // Render rows inside a table with the SAME STYLING as the real output
  container.innerHTML = `
    <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-family: Arial, sans-serif;">
      ${generateTableHeader()}
      <tbody>
        ${rows.map(generateRow).join("")}
      </tbody>
    </table>
  `;

  document.body.appendChild(container);

  // Measure each tr
  const trs = container.querySelectorAll("tr");
  const heights = Array.from(trs).map(
    (tr) => tr.getBoundingClientRect().height,
  );

  // Cleanup
  document.body.removeChild(container);
  return heights;
};

/**
 * Splits transactions into pages based on measured pixel heights.
 */
const paginateByMeasuredHeight = (
  rows: TransactionRow[],
  heights: number[],
): TransactionRow[][] => {
  const pages: TransactionRow[][] = [];
  let currentPage: TransactionRow[] = [];
  let usedPx = 0;

  rows.forEach((row, i) => {
    const rowH = heights[i] || ROW_HEIGHT_PX;
    if (usedPx + rowH > AVAIL_PX && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      usedPx = 0;
    }
    currentPage.push(row);
    usedPx += rowH;
  });

  if (currentPage.length > 0) pages.push(currentPage);
  if (pages.length === 0) pages.push([]);

  return pages;
};

// ── Header (every page) ───────────────────────────────────────────────────────
const generateHeader = (info: BankAlHabibAccountInfo) => `
  <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 30px 80px 0px 50px;">
    <!-- Left: logo + bank name + branch + address -->
    <div style="display: flex; align-items: flex-start; gap: 20px;">
      <img src="/bankal-habib-logo.png" alt="Bank AL Habib" style="height: 80px; width: auto;" />
      <div style="${FONT} padding-top: 2px;">
        <div style="font-size: 12pt; font-weight: bold; color: #000; margin-bottom: 4px;">Bank AL Habib Limited</div>
        <div style="font-size: 8pt; color: #000; margin-bottom: 1px;">${info.branchName}</div>
        <div style="font-size: 8pt; color: #000;">${info.branchAddress}</div>
      </div>
    </div>
    <!-- Right: print date -->
    <div style="${FONT} font-size: 8pt; color: #000; text-align: right; padding-top: 4px;">
      <span style="padding-right:4px;">Print Date:</span> ${ensureDMY(info.printDate)}
    </div>
  </div>
`;

// ── Account Info Section (every page) ─────────────────────────────────────────
const generateAccountSection = (info: BankAlHabibAccountInfo) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(info.qrText)}`;
  return `
  <div style="padding: 0 16px 40px 16px;">
    <!-- Heading row: STATEMENT OF ACCOUNT + QR on right -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <div style="flex: 1; text-align: center; padding: 0 0 30px 40px;">
        <div style="${FONT} font-size: 10pt; font-weight: bold; color: #000;">STATEMENT OF ACCOUNT</div>
        <div style="${FONT} font-size: 9pt; color: #000; margin-top: 4px;">From ${ensureDMY(info.fromDate)} &nbsp; &nbsp; To ${ensureDMY(info.toDate)}</div>
      </div>
      <!-- QR Code in frame -->
      <div>
      <div style="border: 1px solid #000; padding: 6px 14px 4px 16px; display: inline-block; text-align: center;">
        <img src="${qrUrl}" width="60" height="60" alt="QR" style="display: block;" />
        
      </div>
      <div style="${FONT} text-align: left; font-size: 7pt; color: #000; margin-top: 6px; max-width: 80px; word-break: break-word; line-height: 1.2;">${info.qrSubText}</div>
      </div>
    </div>

    <!-- Account fields: two columns -->
    <div style="display: flex; gap: 20px; margin-top: 6px; ${FONT} font-size: 8pt; padding: 0px 80px 0px 50px;">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center;"><span style="width: 80px">Name:</span> ${info.accountName}</div>
        <div style="display: flex; align-items: center; margin-top: 6px;"><span style="width: 80px">Address:</span> ${info.address1 || '.'}</div>
        <div style="display: flex; align-items: center; margin-top: 6px; padding-left: 80px;">${info.address2 || '.'}</div>
        <div style="display: flex; align-items: center; margin-top: 6px; padding-left: 80px;">${info.address3 || '.'}</div>
        <div style="display: flex; align-items: center; margin-top: 6px; padding-left: 80px;">${info.address4 || '.'}</div>
        
      </div>
      <div style="flex: 1;">
        <div style="display: flex; align-items: center;"><span style="width: 100px">Account No:</span> ${info.accountNo}</div>
        <div style="display: flex; align-items: center; margin-top: 6px;"><span style="width: 100px">Account Type:</span> ${info.accountType}</div>
        <div style="display: flex; align-items: center; margin-top: 6px;"><span style="width: 100px">Currency:</span> ${info.currency}</div>
      </div>
    </div>
  </div>
`;
};

// ── Table header ──────────────────────────────────────────────────────────────
// border-collapse: separate + border-radius on first/last TH gives rounded row border
const TH_BASE = `${FONT} font-size: 8pt; font-weight: bold; background: #ebebeb; padding: 8px 4px; border-top: 2px solid #000; border-bottom: 2px solid #000; color: #000; line-height: 1.4;`;
const TH_FIRST = `${TH_BASE} border-left: 2px solid #000; border-radius: 10px 0 0 10px;`;
const TH_LAST = `${TH_BASE} border-right: 2px solid #000; border-radius: 0 10px 10px 0;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH_FIRST} width: 13%; text-align: center;">DATE</th>
      <th style="${TH_BASE}  width: 9%; text-align: center;">VALUE DATE</th>
      <th style="${TH_BASE}  width: 12%; text-align: center;">INSTRUMENT/<br/>DOC NO.</th>
      <th style="${TH_BASE}  width: 34%; text-align: center;">DETAILS</th>
      <th style="${TH_BASE}  width: 7%; text-align: right;">DEBIT</th>
      <th style="${TH_BASE}  width: 12%; text-align: right;">CREDIT</th>
      <th style="${TH_LAST}  width: 13%; text-align: right;">BALANCE</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD = `${FONT} font-size: 8pt; padding:24px 4px 4px 4px; color: #000;`;
const TD_NUM = `${TD} text-align: right;`;

const generateRow = (tx: TransactionRow) => {
  const isBold = tx.isOpeningBalance || tx.isClosingBalance;
  const weight = isBold ? "font-weight: bold;" : "";

  return `
  <tr>
    <td style="${TD} ${weight} text-align: center;">${ensureDMY(tx.date)}</td>
    <td style="${TD} ${weight} text-align: center;">${ensureDMY(tx.valueDate)}</td>
    <td style="${TD} ${weight} text-align: center;">${tx.instNo || ""}</td>
    <td style="${TD} ${weight}">${tx.particulars}</td>
    <td style="${TD_NUM} ${weight}">${tx.debit || ""}</td>
    <td style="${TD_NUM} ${weight}">${tx.credit || ""}</td>
    <td style="${TD_NUM} ${weight}">${tx.balance}</td>
  </tr>`;
};

// ── Page number div ───────────────────────────────────────────────────────────
const generatePageNum = (pageNum: number, totalPages: number) => `
  <div style="margin: 6px 16px 28px 16px; border: 2px solid #000; border-radius: 5px;
              background: #ebebeb; text-align: center; padding: 6px 0;
              ${FONT} font-size: 8pt; color: #000;">
    Page ${pageNum} of ${totalPages}
  </div>
`;

// ── Footer bar (every page) ───────────────────────────────────────────────────
const generateFooterBar = () => `
  <div style="margin: 4px 16px 20px 16px; display: flex; justify-content: space-between;
              ${FONT} font-size: 8pt; font-weight: bold; color: #000; padding: 0 60px 0 20px;">
    <span>Your Bank NationWide</span>
    <span>www.bankalhabib.com</span>
    <span>For More Information Please Call : 111-014-014</span>
  </div>
`;

// ── Disclaimer page (2nd-last) ────────────────────────────────────────────────
const generateDisclaimerContent = () => `
  <div style="padding: 24px 16px;">
   <img src="/bank-alhabib-disc1.png" alt="content" style="width:100%; height:500px;"/>
  </div>
`;

// ── Last page complaint content ───────────────────────────────────────────────
const generateComplaintContent = () => `
  <div style="padding: 24px 16px;">
     <img src="/bank-alhabib-disc2.png" alt="content" style="width:100%; height:500px;"/>
  </div>
`;

// ── Main Layout ───────────────────────────────────────────────────────────────
export const generateBankAlHabibHTML = async (
  transactions: TransactionRow[],
  info: BankAlHabibAccountInfo,
): Promise<string> => {
  const measuredHeights = measureRowHeights(transactions);
  const txPages = paginateByMeasuredHeight(transactions, measuredHeights);
  const totalPages = txPages.length + 2; // +2 for disclaimer + last page

  // Page num + footer bar always pinned to bottom via absolute positioning.
  // Footer bar only rendered on the last page, just above the page number box.
  const buildPage = (
    pageNum: number,
    bodyHtml: string,
    isLastPage: boolean,
    pageBreak = true,
  ) => `
    <div style="display: flex; flex-direction: column; height: ${A4_HEIGHT_PX}px; overflow: hidden; page-break-before: ${pageBreak ? "always" : "auto"};">
      ${generateHeader(info)}
      ${generateAccountSection(info)}
      <div style="flex: 1; min-height: 0; overflow: hidden; padding-bottom: ${PAGE_NUM_GAP}px;">
        ${bodyHtml}
      </div>
      ${isLastPage ? generateFooterBar() : ""}
      ${generatePageNum(pageNum, totalPages)}
    </div>
  `;

  // Transaction pages
  const txPagesHtml = txPages.map((rows, idx) => {
    const tableHtml = `
      <div style="padding: 0 16px;">
        <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
          ${generateTableHeader()}
          <tbody>
            ${rows.map(generateRow).join("")}
          </tbody>
        </table>
      </div>
    `;
    return buildPage(idx + 1, tableHtml, false, idx > 0);
  });

  // Disclaimer page (2nd-last) — has table header then disclaimer text
  const disclaimerPageHtml = buildPage(
    txPages.length + 1,
    `<div style="padding: 0 16px;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
        ${generateTableHeader()}
      </table>
     </div>
     ${generateDisclaimerContent()}`,
    false,
    true,
  );

  // Last page — has table header then complaint text
  const lastPageHtml = buildPage(
    totalPages,
    `<div style="padding: 0 16px;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
        ${generateTableHeader()}
      </table>
     </div>
     ${generateComplaintContent()}`,
    true,
    true,
  );

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
        <title>Bank AL Habib Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width: 100%; max-width: 800px; margin: auto;">
          ${txPagesHtml.join("")}
          ${disclaimerPageHtml}
          ${lastPageHtml}
        </div>
      </body>
    </html>
  `;
};
