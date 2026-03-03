import { TransactionRow, BankAlHabibAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ───────────────────────────────────────────────────────
const A4_HEIGHT_PX   = 1123;
const HEADER_PX      = 105;  // logo + bank name + branch + address
const ACCT_INFO_PX   = 125;  // statement heading + from/to + account fields
const TBL_HEADER_PX  = 32;   // column header row
const PAGE_NUM_PX    = 44;   // page number div height
const PAGE_NUM_GAP   = 20;   // gap between last row and page number box
// Total bottom reserved: margin-top(6) + box + margin-bottom(28) + gap
const BOTTOM_RESERVED_PX = 6 + PAGE_NUM_PX + 28 + PAGE_NUM_GAP;

const ROW_HEIGHT_PX  = 22;

// Available rows per page (same on every page — account info repeats on all pages)
const AVAIL_PX = A4_HEIGHT_PX - HEADER_PX - ACCT_INFO_PX - TBL_HEADER_PX - BOTTOM_RESERVED_PX;
const MAX_ROWS = Math.floor(AVAIL_PX / ROW_HEIGHT_PX);

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateTransactions = (rows: TransactionRow[]): TransactionRow[][] => {
  if (rows.length === 0) return [[]];
  const pages: TransactionRow[][] = [];
  let remaining = [...rows];
  while (remaining.length > 0) pages.push(remaining.splice(0, MAX_ROWS));
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
      <span style="padding-right:4px;">Print Date:</span> ${info.printDate}
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
        <div style="${FONT} font-size: 9pt; color: #000; margin-top: 4px;">From ${info.fromDate} &nbsp; &nbsp; To ${info.toDate}</div>
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
        <div style="display: flex; align-items: center; margin-top: 6px;"><span style="width: 80px">Address:</span> ${info.address1}</div>
        <div style="display: flex; align-items: center; margin-top: 6px; padding-left: 80px;">.</div>
        <div style="display: flex; align-items: center; margin-top: 6px; padding-left: 80px;">.</div>
        <div style="display: flex; align-items: center; margin-top: 6px; padding-left: 80px;">${info.address2}</div>
        
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
const TH_LAST  = `${TH_BASE} border-right: 2px solid #000; border-radius: 0 10px 10px 0;`;

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
    <td style="${TD} ${weight} text-align: center;">${tx.date}</td>
    <td style="${TD} ${weight} text-align: center;">${tx.valueDate || ""}</td>
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
export const generateBankAlHabibHTML = (
  transactions: TransactionRow[],
  info: BankAlHabibAccountInfo,
): string => {
  const txPages = paginateTransactions(transactions);
  const totalPages = txPages.length + 2; // +2 for disclaimer + last page

  // Page num + footer bar always pinned to bottom via absolute positioning.
  // Footer bar only rendered on the last page, just above the page number box.
  const buildPage = (pageNum: number, bodyHtml: string, isLastPage: boolean, pageBreak = true) => `
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
