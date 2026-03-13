import { TransactionRow, AskariAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX = 1123;
const TOP_PX       = 268;  // logo + account info section (same every page)
const TBL_HDR_PX   = 26;
const FOOTER_PX    = 112;  // NOTICE section (every page)
const TFOOT_PX     = 50;   // CLOSING BALANCE + TOTAL rows (last page only)

const AVAIL      = A4_HEIGHT_PX - TOP_PX - TBL_HDR_PX - FOOTER_PX;
const AVAIL_LAST = AVAIL - TFOOT_PX;

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size:7.5pt; font-weight:bold; padding:3px 5px;
            border-top:2px solid #555; border-bottom:2px solid #555;
            vertical-align:middle; color:#000;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} text-align: left; padding-left: 8px; border-left:2px solid #555; width:9.5%;">DATE</th>
      <th style="${TH} width:43.5%; text-align: left;">PARTICULARS</th>
      <th style="${TH} width:11%; text-align: center;">INS #/Time</th>
      <th style="${TH} width:14%; text-align: left;">VAL DATE</th>
      <th style="${TH} width:11%; text-align:left;">AMOUNT</th>
      <th style="${TH} border-right:2px solid #555; width:11%; text-align:right;">BALANCE</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD     = `${FONT} font-size:7pt; padding:2px 5px 8px 5px; border-bottom:1.5px solid #555;
                vertical-align:top; color:#000; line-height:1.35;`;
const TD_NUM = `${TD} text-align:right;`;

const fmtAmount = (tx: TransactionRow): string => {
  if (tx.debit)  return `${tx.debit}&nbsp;DB`;
  if (tx.credit) return tx.credit;
  return "";
};

const generateRow = (tx: TransactionRow) => {
  const bold = (tx.isOpeningBalance || tx.isClosingBalance) ? "font-weight:bold;" : "";
  return `
  <tr>
    <td style="${TD} ${bold} border-left:2px solid #555;">${tx.date}</td>
    <td style="${TD} ${bold}">${tx.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD} ${bold} text-align: center;">${tx.instNo || ""}</td>
    <td style="${TD} ${bold}">${tx.valueDate || ""}</td>
    <td style="${TD} ${bold}">${fmtAmount(tx)}</td>
    <td style="${TD_NUM} ${bold} border-right:2px solid #555;">${tx.balance || ""}</td>
  </tr>`;
};

// ── DOM-based row height measurement ─────────────────────────────────────────
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  const container = document.createElement("div");
  // A4 width (794px) minus left+right padding (40px × 2) = 714px
  container.style.cssText =
    "position:absolute; top:-9999px; left:-9999px; width:714px; visibility:hidden;";
  container.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
      ${generateTableHeader()}
      <tbody>${rows.map(generateRow).join("")}</tbody>
    </table>`;
  document.body.appendChild(container);
  const trs = container.querySelectorAll("tbody tr");
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
  const remaining  = rows.slice();
  const remHeights = heights.slice();

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
    const remTotal = remHeights.reduce((s, h) => s + h, 0);
    if (remTotal <= AVAIL_LAST) {
      pages.push(remaining.splice(0));
      break;
    }
    pages.push(fillPage(AVAIL));
  }

  if (pages.length === 0) pages.push([]);
  return pages;
};

// ── Page header (every page) ──────────────────────────────────────────────────
const generateHeader = (
  info: AskariAccountInfo,
  pageNum: number,
  totalPages: number,
) => `
  <div style="padding: 28px 20px 8px 20px;">

    <!-- Logo -->
    <div style="margin-bottom:14px;">
      <img src="/askari-logo.png" alt="Askari Bank" style="height:38px; width:auto;" />
    </div>

    <!-- Two-column account info -->
    <div style="padding: 40px 20px; display:flex; justify-content:space-between; align-items:flex-start;
                ${FONT}">

      <!-- Left: Name + Address -->
      <div style="line-height:1.2;">
        <div style="display:flex; gap: 10px; margin-bottom: 8px;">
          <span style="font-size:8pt; font-weight: 540; color: #313131; min-width:50px; text-align: right;">Name:</span>
          <span style="font-weight: bold; font-size:8.5pt;">${info.name}</span>
        </div>
        <div style="display:flex; align-items:flex-start; gap: 10px;">
          <span style="min-width:50px; text-align: right; color: #313131; font-size:8pt; font-weight: 540;">Address:</span>
          <div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.address1}</div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.address2}</div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.address3}</div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.phone}</div>
          </div>
        </div>
      </div>

      <!-- Right: Branch, Period, Account details -->
      <div style="min-width:330px; line-height:1.2;">
        <div style="color: #313131; font-size:8pt; font-weight: 540;">Branch Code &amp; Branch Name</div>
        <div style="font-weight: bold; margin-bottom:8px; font-size:8.5pt;">${info.branchName}</div>
        <div style="color: #313131; font-size:8pt; font-weight: 540;">STATEMENT PERIOD</div>
        <div style="font-weight: bold; margin-bottom:20px; font-size:8.5pt;">From: ${info.fromDate}&nbsp;&nbsp;To&nbsp;&nbsp;${info.toDate}</div>
        <!-- 3-col row: Account Number | Currency/Type | Page info -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="color: #313131; font-size:8pt; font-weight: 540;">ACCOUNT NUMBER</div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.accountNumber}</div>
          </div>
          <div style="display:flex; align-items:flex-start; gap: 6px;">
          <div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.currency}</div>
            <div style="font-weight: bold; font-size:8.5pt;">Askari Islamic</div>
            <div style="font-weight: bold; font-size:8.5pt;">${info.accountType}</div>
          </div>
          <div>
            <div style="font-size:8pt; font-weight: 540;"><span style="font-weight: bold; font-size:8.5pt;">PAGE:</span>&nbsp;${pageNum} of ${totalPages}</div>
            <div style="font-weight: bold; font-size:8pt; font-weight: 540;">Issued On</div>
            <div style="font-size:8pt; font-weight: 540;">${info.issuedOn}</div>
          </div>
          </div>
        </div>
      </div>

    </div>
  </div>
`;

// ── Number helpers ────────────────────────────────────────────────────────────
const parseAmt = (s: string): number => {
  const n = Number(s.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmt2dec = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Table footer (last page only) ─────────────────────────────────────────────
const TF = `${FONT} font-size:7pt; padding:2px 5px; border-bottom:1px solid #e8e8e8;
            vertical-align:top; color:#000; font-weight:bold;`;

const generateTableFooter = (
  closingBalance: string,
  totalCredit: string,
  totalDebit: string,
) => `
  <tfoot>
    <tr>
      <td style="${TF}"></td>
      <td style="${TF}">CLOSING BALANCE :</td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF} text-align:right;">${closingBalance}</td>
    </tr>
    <tr>
      <td style="${TF}"></td>
      <td style="${TF}">TOTAL :</td>
      <td style="${TF}"></td>
      <td style="${TF}"></td>
      <td style="${TF} text-align:right; line-height:1.7;">
        ${totalCredit}<br>${totalDebit}&nbsp;DB
      </td>
      <td style="${TF}"></td>
    </tr>
  </tfoot>
`;

// ── NOTICE footer (every page) ────────────────────────────────────────────────
const generateNotice = () => `
  <div style="padding:4px 44px 20px 44px; flex-shrink:0;
              ${FONT} font-size:5.8pt; color:#000; line-height:1.25;">
    <div style="font-weight:bold; margin-bottom:1px;">
      <span style="color: #313131;">NOTICE : </span>Please report any discrepancy/error in this statement, in writing, within 60 days
      from the date of issuance, also this will be understood that the statement is correct.
    </div>
    <div>1) As per SBP requirement, please submit an attested copy of your CNIC immediately,
      otherwise we will be constrained to discontinue our relationship. Please ignore this if
      already provided.</div>
    <div>2) You have an option for converting your existing account to Basic Banking Account.
      For details please contact Branch Manager.</div>
    <div>3) The eCIB contains all relevant information about your loans from the banking sector
      irrespective of amount. Any default or delays in making regular payments against loans
      Can affect your credit worthiness and you may be unable to avail further financing from
      the banking system. Further, in case of consumer loans, default history will be Maintained
      for certain period after adjustment of default amount. For further information on eCIB,
      you may visit the website www.sbp.org.pk/ecibhelpdesk</div>
    <div>4) Please communicate any changes in your particulars currently available with us in
      order to update our records.</div>
    <div>5) Our bank schedule of charges currently enforced has been placed on our website for
      easy reference. Please visit our web-site www.askaribank.com for any related information.
    </div>
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateAskariHTML = async (
  transactions: TransactionRow[],
  info: AskariAccountInfo,
): Promise<string> => {
  // Exclude closing-balance rows from tbody (rendered in tfoot instead)
  const regularTx     = transactions.filter((tx) => !tx.isClosingBalance);
  const closingBalance = regularTx[regularTx.length - 1]?.balance ?? "";

  // Calculate totals
  const totalCredit = fmt2dec(regularTx.reduce((s, tx) => s + parseAmt(tx.credit), 0));
  const totalDebit  = fmt2dec(regularTx.reduce((s, tx) => s + parseAmt(tx.debit),  0));

  const measuredHeights = measureRowHeights(regularTx);
  const txPages    = paginateByMeasuredHeight(regularTx, measuredHeights);
  const totalPages = txPages.length;

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${generateHeader(info, pageNum, totalPages)}
        <div style="padding:0 40px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
            </tbody>
            ${isLastPage ? generateTableFooter(closingBalance, totalCredit, totalDebit) : ""}
          </table>
        </div>
        <div style="flex:1;"></div>
        ${generateNotice()}
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
        <title>Askari Bank Statement</title>
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
