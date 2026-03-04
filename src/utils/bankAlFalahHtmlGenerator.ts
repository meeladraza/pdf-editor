import { TransactionRow, BankAlFalahAccountInfo } from "../types";

const FONT = "font-family: 'Times New Roman', serif;";

// ── Pagination constants ───────────────────────────────────────────────────────
const A4_HEIGHT_PX       = 1123;
const HEADER_PX          = 36;   // date/time + stmtText bar
const RED_HEADING_PX     = 22;   // "THIS IS UNOFFICIAL..." (page 1 only)
const OPENING_BAL_PX     = 22;   // "OPENING BALANCE:" (page 1 only)
const TBL_HEADER_PX      = 28;   // column header row
const FAV_SECTION_PX     = 190;  // Favourites + filter box (last page only)
const FOOTER_PX          = 30;   // footer bar
const ROW_HEIGHT_PX      = 20;

const AVAIL_FIRST_AND_LAST = A4_HEIGHT_PX - HEADER_PX - RED_HEADING_PX - OPENING_BAL_PX - TBL_HEADER_PX - FAV_SECTION_PX - FOOTER_PX;
const AVAIL_FIRST_ONLY     = A4_HEIGHT_PX - HEADER_PX - RED_HEADING_PX - OPENING_BAL_PX - TBL_HEADER_PX - FOOTER_PX;
const AVAIL_LAST_ONLY      = A4_HEIGHT_PX - HEADER_PX - TBL_HEADER_PX - FAV_SECTION_PX - FOOTER_PX;
const AVAIL_MIDDLE         = A4_HEIGHT_PX - HEADER_PX - TBL_HEADER_PX - FOOTER_PX;

const MAX_ROWS_SINGLE  = Math.floor(AVAIL_FIRST_AND_LAST / ROW_HEIGHT_PX);
const MAX_ROWS_FIRST   = Math.floor(AVAIL_FIRST_ONLY / ROW_HEIGHT_PX);
const MAX_ROWS_LAST    = Math.floor(AVAIL_LAST_ONLY / ROW_HEIGHT_PX);
const MAX_ROWS_MIDDLE  = Math.floor(AVAIL_MIDDLE / ROW_HEIGHT_PX);

// ── Pagination ─────────────────────────────────────────────────────────────────
const paginateTransactions = (rows: TransactionRow[]): TransactionRow[][] => {
  if (rows.length === 0) return [[]];

  // All rows fit on a single page (first + last combined constraints)
  if (rows.length <= MAX_ROWS_SINGLE) return [rows];

  const pages: TransactionRow[][] = [];
  let remaining = [...rows];

  // First page
  pages.push(remaining.splice(0, MAX_ROWS_FIRST));

  // Middle pages (leave enough for last page)
  while (remaining.length > MAX_ROWS_LAST) {
    pages.push(remaining.splice(0, MAX_ROWS_MIDDLE));
  }

  // Last page
  pages.push(remaining);
  return pages;
};

// ── Header bar (every page) ───────────────────────────────────────────────────
const generateHeader = (info: BankAlFalahAccountInfo) => `
  <div style="width: 70%; 'Times New Roman', serif; display: flex; justify-content: space-between; align-items: center;
              padding: 20px 32px 12px 32px; font-family: Arial, sans-serif; font-weight: 400; font-size: 8pt; color: #000;">
    <span>${info.printDateTime}</span>
    <span>${info.stmtText}</span>
  </div>
`;

// ── Red unofficial heading (page 1 only) ──────────────────────────────────────
const generateRedHeading = () => `
  <div style="${FONT} font-size: 8pt; font-weight: 580; color: #a92f33;
              padding: 2px 58px;">
    THIS IS UNOFFICIAL ACCOUNT STATEMENT
  </div>
`;

// ── Opening balance line (page 1 only) ────────────────────────────────────────
const generateOpeningBalanceLine = (info: BankAlFalahAccountInfo) => `
  <div style="${FONT} font-size: 8pt; font-weight: 580; color: #a92f33;
              padding: 2px 58px;">
    <span>OPENING BALANCE :</span>
    <span style="margin-left: 120px;">${info.openingBalance}</span>
  </div>
`;

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size: 8pt; font-weight: bold; color: #000;
            padding: 2px 0px; background: #fff; text-align: left;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width: 9%;">Post Date</th>
      <th style="${TH} width: 16%;">Description</th>
      <th style="${TH} width: 13%;">Cheque/Inst #</th>
      <th style="${TH} width: 11%;">Value Date</th>
      <th style="${TH} width: 14%;">Debit Amount</th>
      <th style="${TH} width: 14%;">Credit Amount</th>
      <th style="${TH} width: 9%;">Balance</th>
      <th style="${TH} width: 14%;">Initiated Branch</th>
    </tr>
  </thead>
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
const parseAmount = (val: string): number => {
  if (!val) return 0;
  const trimmed = val.trim();
  if (!trimmed || /^-+$/.test(trimmed)) return 0;
  const num = parseFloat(trimmed.replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
};

const formatAmount = (val: number): string =>
  val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Transaction row ───────────────────────────────────────────────────────────
const TD = `${FONT} font-size: 8pt; color: #000; padding: 2px 0px;`;

const generateRow = (tx: TransactionRow) => {
  return `
  <tr>
    <td style="${TD} text-align: center;">${tx.date}</td>
    <td style="${TD}">${tx.particulars}</td>
    <td style="${TD} text-align: center;">${tx.instNo || ""}</td>
    <td style="${TD} text-align: center;">${tx.valueDate || ""}</td>
    <td style="${TD} text-align: right;">${tx.debit || ""}</td>
    <td style="${TD} text-align: right;">${tx.credit || ""}</td>
    <td style="${TD} text-align: right;">${tx.balance}</td>
    <td style="${TD} text-align: center;">${tx.tranBranch || ""}</td>
  </tr>`;
};

// ── Total row (tfoot, last page only) ─────────────────────────────────────────
const TD_TOTAL = `${FONT} font-size: 8pt; color: #000; padding: 2px 0px;`;

const generateTotalRow = (totalDebit: number, totalCredit: number) => `
  <tfoot>
    <tr>
      <td style="${TD_TOTAL}"></td>
      <td style="${TD_TOTAL} text-align: right; padding-right: 8px;">TOTAL :</td>
      <td style="${TD_TOTAL}"></td>
      <td style="${TD_TOTAL}"></td>
      <td style="${TD_TOTAL} text-align: right;">${totalDebit === 0 ? "-" : formatAmount(totalDebit)}</td>
      <td style="${TD_TOTAL} text-align: right;">${formatAmount(totalCredit)}</td>
      <td style="${TD_TOTAL}"></td>
      <td style="${TD_TOTAL}"></td>
    </tr>
  </tfoot>
`;

// ── Favourites + filter box (last page only) ──────────────────────────────────
const generateFavouritesSection = (info: BankAlFalahAccountInfo) => `
  <div style="width: 70%; display: flex; gap: 24px; padding: 20px 32px 20px 58px; align-items: flex-start;">

    <!-- Box 1: Favourites tab -->
    <div style="border: 1px solid #ccc;
                 padding: 6px; ${FONT} font-size: 9pt; font-weight: bold; white-space: nowrap;
                 display: inline-block; cursor: pointer;">
      <span style="border-top: 1px solid #000; border-bottom: 1px solid #ccc; w-full padding: 14px 6px; min-width:120px;">Favourites</span>
    </div>

    <!-- Box 2: Filter search box -->
    <div style="border: 1px solid #ccc; flex: 1;">

      <!-- Header row: stmtText | More Options + Clear Selection + Find -->
      <div style="display: flex; align-items: center; justify-content: space-between;
                  border-bottom: 1px solid #ccc; padding: 5px 8px;">
        <span style="${FONT} font-size: 9pt; font-weight: bold;">${info.stmtText}</span>
        <div style="display: flex; align-items: center; gap: 4px;">
          <div style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1.6;">
            <a style="color: #00c; text-decoration: underline; ${FONT} font-size: 8pt; cursor: pointer;">More Options</a>
            <a style="color: #00c; text-decoration: underline; ${FONT} font-size: 8pt; cursor: pointer;">Clear Selection</a>
          </div>
          <span style="border: 1px solid #aaa; box-shadow: 1px 1px 2px rgba(0,0,0,0.18);
                       padding: 2px 10px; ${FONT} font-size: 8pt; background: #f5f5f5;
                       margin-left: 4px; cursor: pointer;">Find</span>
        </div>
      </div>

      <!-- BOOKING DATE row -->
      <div style="display: flex; align-items: center; gap: 8px; padding: 10px 32px;">
        <label style="${FONT} font-size: 8pt; font-weight: bold; min-width: 110px;">BOOKING DATE</label>
        <div style="border: 1px solid #aaa; padding: 2px 6px; ${FONT} font-size: 8pt;
                    min-width: 90px; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
          <span>equals</span><span>&#9660;</span>
        </div>
        <div style="border: 1px solid #aaa; padding: 2px 8px; ${FONT} font-size: 8pt; min-width: 40px;">
          ${info.bookingDate}
        </div>
      </div>

      <!-- ACCOUNT row -->
      <div style="display: flex; align-items: center; gap: 8px; padding: 4px 8px 8px 8px;">
        <label style="${FONT} font-size: 8pt; font-weight: bold; min-width: 110px;">ACCOUNT</label>
        <span style="${FONT} font-size: 8pt;">equals</span>
        <div style="border: 1px solid #aaa; padding: 2px 8px; ${FONT} font-size: 8pt; min-width: 110px;">
          ${info.accountNo}
        </div>
      </div>

      <!-- Separator -->
      <div style="border-bottom: 1px solid #ccc; margin: 0 8px 4px 8px;"></div>

      <!-- Account IBAN row -->
      <div style="padding: 4px 8px 6px 8px; ${FONT} font-size: 8pt; color: #000;">
        Account IBAN : ${info.iban} : ${info.stmtText}
      </div>

    </div>
  </div>
`;

// ── Footer (every page) ───────────────────────────────────────────────────────
const generateFooter = (pageNum: number, totalPages: number) => `
  <div style="display: flex; justify-content: space-between; align-items: center;
              padding: 4px 16px; ${FONT} font-size: 8pt; color: #000;
              border-top: 1px solid #ccc; margin-top: auto;">
    <a href="https://t24.bankalfalah.com/BAFT24/servlet/BrowserServlet"
       style="color: #000; text-decoration: none;">
      https://t24.bankalfalah.com/BAFT24/servlet/BrowserServlet
    </a>
    <span>${pageNum}/${totalPages}</span>
  </div>
`;

// ── Main layout ───────────────────────────────────────────────────────────────
export const generateBankAlFalahHTML = (
  transactions: TransactionRow[],
  info: BankAlFalahAccountInfo,
): string => {
  const txPages = paginateTransactions(transactions);
  const totalPages = txPages.length;
  const isSinglePage = totalPages === 1;

  // Calculate totals across all regular transaction rows
  const regularRows = transactions.filter(
    (tx) => !tx.isOpeningBalance && !tx.isClosingBalance &&
            !tx.particulars.toUpperCase().includes("TOTAL"),
  );
  const totalDebit  = regularRows.reduce((sum, tx) => sum + parseAmount(tx.debit),  0);
  const totalCredit = regularRows.reduce((sum, tx) => sum + parseAmount(tx.credit), 0);

  const buildPage = (
    pageNum: number,
    rows: TransactionRow[],
    isFirstPage: boolean,
    isLastPage: boolean,
  ) => `
    <div style="display: flex; flex-direction: column; height: ${A4_HEIGHT_PX}px;
                overflow: hidden; page-break-before: ${pageNum > 1 ? "always" : "auto"};">

      ${generateHeader(info)}

      ${isFirstPage ? generateRedHeading() : ""}
      ${isFirstPage ? generateOpeningBalanceLine(info) : ""}

      <!-- Transaction table (no flex:1 — natural height so Favourites sits right below) -->
      <div style="padding: 0 58px;">
        <table style="width: 86%; border-collapse: collapse;">
          ${generateTableHeader()}
          <tbody>
            ${rows.map(generateRow).join("")}
          </tbody>
          ${isLastPage ? generateTotalRow(totalDebit, totalCredit) : ""}
        </table>
      </div>

      ${isLastPage ? generateFavouritesSection(info) : ""}

      <!-- Spacer pushes footer to page bottom -->
      <div style="flex: 1;"></div>

      ${generateFooter(pageNum, totalPages)}
    </div>
  `;

  const pages = txPages.map((rows, idx) =>
    buildPage(idx + 1, rows, idx === 0, isSinglePage ? true : idx === txPages.length - 1),
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
        <title>Bank AlFalah Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width: 100%; max-width: 800px; margin: auto;">
          ${pages.join("")}
        </div>
      </body>
    </html>
  `;
};
