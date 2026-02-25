import { TransactionRow, MetroAccountInfo } from "../types";
import { formatNumber } from "./faisalExcelParser";

// ── Palette ───────────────────────────────────────────────────────────────────
const GREEN = "#2d6a2d";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX = 1123;
const HEADER_PX = 285;      // logo (90px) + info panel (160px) + gaps + buffer
const TABLE_HEADER_PX = 38; // th padding:10px×2 + 11pt font + border
const PAGE_NUM_PX = 40;     // "Page X of X" line at bottom + 10px bottom padding
const CLOSING_BAL_PX = 20;  // closing balance row (last page)
const FOOTER_TEXT_PX = 75;  // disclaimer text (last page)
const ROW_HEIGHT_PX = 20;   // 12px font + padding + border (actual rendered height)

// Subtract all bottom elements from every page so last page never overflows
const ROWS_PX =
  A4_HEIGHT_PX -
  HEADER_PX -
  TABLE_HEADER_PX -
  PAGE_NUM_PX -
  CLOSING_BAL_PX -
  FOOTER_TEXT_PX;

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateTransactions = (
  transactions: TransactionRow[],
): TransactionRow[][] => {
  const pages: TransactionRow[][] = [];
  let current: TransactionRow[] = [];
  let usedPx = 0;

  for (const tx of transactions) {
    if (usedPx + ROW_HEIGHT_PX > ROWS_PX && current.length > 0) {
      pages.push(current);
      current = [];
      usedPx = 0;
    }
    current.push(tx);
    usedPx += ROW_HEIGHT_PX;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const FONT = "font-family:Arial,sans-serif;";
const TH = `background:${GREEN}; color:#fff; ${FONT} font-size:11pt; font-weight:normal; padding:10px 4px;`;
const TD = `${FONT} font-size:12px; padding:2px 4px; border:1px solid #191919;`;

// ── Header (every page) ───────────────────────────────────────────────────────
const generatePageHeader = (info: MetroAccountInfo) => `
  <div style="text-align:center; padding:30px 10px 20px 10px;">
  <div style="width: 100%; display: flex; justify-content: center;">  
  <img src="/habib-metro-logo.png" alt="HABIB METROPOLITAN BANK LTD" style="width: 400px; height: 40px;" />
  </div>
  </div>
  
  <div style="display:flex; align-items:center; padding:0 10px 6px 10px; gap:12px;">

    <!-- Left: account holder -->
    <div style="width: 50%; ${FONT} font-size:12px; line-height:1.6; padding-left: 20px;">
      <div style="font-weight:500; margin-bottom: 8px;">${info.accountTitle}</div>
      <div style="white-space:pre-line; line-height: 1.3;">${info.address}</div>
    </div>

    <!-- Right: info boxes -->
    <div style="width: 50%; ${FONT}">

      <!-- BRANCH NAME -->
      <div style="font-weight:500; font-size: 9.5pt; letter-spacing:0.5px; margin-bottom:1px;">BRANCH NAME</div>
      <div style="font-size: 9pt; border:1px solid #191919; background-color:#f7f7f7; padding:2px 4px; margin-bottom:8px;">${info.branchName}</div>

      <!-- A/C TYPE + A/C NUMBER -->
      <div style="display:flex; margin-bottom:1px;">
        <div style="flex:1; font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px;">A/C TYPE</div>
        <div style="flex:1; font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px;">A/C NUMBER</div>
      </div>
      <div style="display:flex; margin-bottom:8px;">
        <div style="flex:1; font-size: 9pt; border:1px solid #191919; border-right: none; background-color:#f7f7f7; padding:2px 4px;">${info.acType}</div>
        <div style="flex:1; font-size: 9pt; border:1px solid #191919; background-color:#f7f7f7; padding:2px 4px;">${info.acNumber}</div>
      </div>

      <!-- IBAN -->
      <div style="font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px; margin-bottom:1px;">IBAN</div>
      <div style="font-size: 9pt; border:1px solid #191919; background-color:#f7f7f7; padding:2px 4px; margin-bottom:8px;">${info.iban}</div>

      <!-- CURRENCY + FROM + TO + PRINTED ON -->
      <div style="display:flex; margin-bottom:1px;">
        <div style="flex:1.5; font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px;">CURRENCY</div>
        <div style="flex:1.3; font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px;">FROM</div>
        <div style="flex:1.3; font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px;">TO</div>
        <div style="flex:1.3; font-weight:normal; font-size: 9.5pt; letter-spacing:0.5px;">PRINTED ON</div>
      </div>
      <div style="display:flex; margin-bottom:6px;">
        <div style="flex:1.5; font-size: 9pt; border:1px solid #191919; border-right: none; background-color:#f7f7f7; padding:2px 4px;">${info.currency}</div>
        <div style="flex:1.3; font-size: 9pt; border:1px solid #191919; border-right: none; background-color:#f7f7f7; padding:2px 4px;">${info.from}</div>
        <div style="flex:1.3; font-size: 9pt; border:1px solid #191919; border-right: none; background-color:#f7f7f7; padding:2px 4px;">${info.to}</div>
        <div style="flex:1.3; font-size: 9pt; border:1px solid #191919; background-color:#f7f7f7; padding:2px 4px;">${info.printedOn}</div>
      </div>

    </div>
  </div>
`;

// ── Table column headers ──────────────────────────────────────────────────────
const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} border-right:1px solid #fff; width:12%; text-align:center;">Date</th>
      <th style="${TH} border-right:1px solid #fff; border-left:1px solid #fff; width:39%; text-align:center;">Particulars</th>
      <th style="${TH} border-right:1px solid #fff; border-left:1px solid #fff; width:15%; text-align:center;">Debit</th>
      <th style="${TH} border-right:1px solid #fff; border-left:1px solid #fff; width:14%; text-align:center;">Credit</th>
      <th style="${TH} border-right:1px solid #fff; width:20%; text-align:center;">Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const generateTransactionRow = (tx: TransactionRow, rowIndex: number) => {
  const evenBg = rowIndex % 2 === 1 ? "background-color:#f7f7f7;" : "";
  if (tx.isOpeningBalance || tx.isClosingBalance) {
    const label =
      tx.particulars ||
      (tx.isOpeningBalance ? "Opening Balance" : "Closing Balance");
    return `
      <tr>
        <td colspan="4" style="${FONT} font-size:12px; padding:2px 4px; border-bottom:1px solid #191919; text-align:center; font-weight:normal; ${evenBg}">${label}</td>
        <td style="${FONT} font-size:12px; padding:2px 4px; border:1px solid #191919; border-top: none; text-align:right; font-weight:normal; ${evenBg}">${formatNumber(tx.balance)}</td>
      </tr>
    `;
  }
  return `
    <tr>
      <td style="${TD} text-align:center; ${evenBg}">${tx.date}</td>
      <td style="${TD} text-align:left; ${evenBg}">${tx.particulars}</td>
      <td style="${TD} text-align:right; ${evenBg}">${formatNumber(tx.debit)}</td>
      <td style="${TD} text-align:right; ${evenBg}">${formatNumber(tx.credit)}</td>
      <td style="${TD} text-align:right; ${evenBg}">${formatNumber(tx.balance)}</td>
    </tr>
  `;
};

// ── Footer disclaimer (last page only) ───────────────────────────────────────
const generateFooterText = () => `
  <div style="padding:6px 10px 20px 10px; font-family:Arial,sans-serif; font-size:9.5px; line-height:1.4; color:#000;">
    <p style="margin:0 0 12px 0;">
      Please report any discrepancy in the above statement, in writing, within 30 days from the date of issue,
      otherwise it will be understood that statement is correct. For complaints which remain unresolved beyond
      45 days, you may write to Banking Mohtasib Pakistan, Shaheen Complex, M.R. Kiyani Road, Karachi or
      visit "www.bankingmohtasib.gov.pk"
    </p>
    <p style="margin:0; font-size:11.8px; text-align:right; direction:rtl;">
      پچاس دن سے نادیدہ تصفیہ شدہ شکایات کے لئے ہمارے بینکنگ محتسب پاکستان، ایم آر کیانی روڈ، کراچی سے رجوع کریں یا ویب سائٹ "www.bankingmohtasib.gov.pk" دیکھیں
    </p>
  </div>
`;

// ── Page number (every page) ──────────────────────────────────────────────────
const generatePageNumber = (pageNum: number, totalPages: number) => `
  <div style="padding:4px 32px 24px 10px; text-align:right;
              font-family:Arial,sans-serif; font-size:11px; color:#000;">
    Page ${pageNum} of ${totalPages}
  </div>
`;

// ── Single page wrapper ───────────────────────────────────────────────────────
const generatePageContent = (
  pageTxns: TransactionRow[],
  allTxns: TransactionRow[],
  info: MetroAccountInfo,
  isFirstPage: boolean,
  isLastPage: boolean,
  pageNum: number,
  totalPages: number,
) => {
  // Closing balance row from allTxns (last page only)
  const closingRow = isLastPage
    ? allTxns.find((t) => t.isClosingBalance)
    : null;

  // Filter out closing balance from regular rows (avoid duplicate if it came in pageTxns)
  const rows = pageTxns.filter((t) => !t.isClosingBalance);

  // Closing balance html (last page only)
  let closingHtml = "";
  if (isLastPage) {
    if (closingRow) {
      closingHtml = generateTransactionRow(closingRow, rows.length);
    } else {
      // If no explicit closing balance row, build one from last balance
      const regular = allTxns.filter(
        (t) => !t.isOpeningBalance && !t.isClosingBalance,
      );
      const last = regular[regular.length - 1];
      if (last) {
        closingHtml = `
          <tr>
            <td colspan="4" style="${FONT} font-size:12px; padding:2px 4px; border-top:1px solid #191919; border-bottom:1px solid #191919; text-align:center; font-weight:normal;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Closing Balance</td>
            <td style="${FONT} font-size:12px; padding:2px 4px; border-top:1px solid #191919; border-bottom:1px solid #191919; text-align:right; font-weight:normal;">${formatNumber(last.balance)}</td>
          </tr>
        `;
      }
    }
  }

  return `
    <div style="page-break-before:${isFirstPage ? "auto" : "always"}; page-break-inside:avoid;">
      ${generatePageHeader(info)}
      <div style="padding:0 10px;">
        <table style="width:100%; border-collapse:collapse;" cellspacing="0">
          ${generateTableHeader()}
          <tbody>
            ${rows.map((tx, i) => generateTransactionRow(tx, i)).join("")}
            ${closingHtml}
          </tbody>
        </table>
      </div>
      ${isLastPage ? generateFooterText() : ""}
      ${generatePageNumber(pageNum, totalPages)}
    </div>
  `;
};

// ── Main export ───────────────────────────────────────────────────────────────
export const generateMetroHTML = (
  transactions: TransactionRow[],
  info: MetroAccountInfo,
): string => {
  // Exclude closing balance from pagination (rendered separately on last page)
  const txnsForPaging = transactions.filter((t) => !t.isClosingBalance);
  const pages = paginateTransactions(txnsForPaging);
  const totalPages = Math.max(1, pages.length);

  const pagesHtml = pages
    .map((pageTxns, idx) =>
      generatePageContent(
        pageTxns,
        transactions,
        info,
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
        <title>Habib Metropolitan Bank Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width:100%; background:#fff; padding:0px 20px;">
          ${pagesHtml}
        </div>
      </body>
    </html>
  `;
};
