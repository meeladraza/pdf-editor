import { TransactionRow, AskariAccountInfo } from "../types";

// Each row extended with display flags for date-grouped rendering
interface AskariRow extends TransactionRow {
  showDate: boolean;    // true for the first transaction of a date group
  showBalance: boolean; // true for the last transaction of a date group
}

const FONT = "font-family: Arial, sans-serif;";

// ── Page height ───────────────────────────────────────────────────────────────
const A4_HEIGHT_PX = 1123;

// ── Group transactions by date ────────────────────────────────────────────────
// Opening Balance is always its own single-row group.
// Opening Balance is grouped with same-date transactions (no special isolation).
const buildDisplayRows = (transactions: TransactionRow[]): AskariRow[] => {
  const groups: TransactionRow[][] = [];
  let currentDate  = "";
  let currentGroup: TransactionRow[] = [];

  for (const tx of transactions) {
    if (tx.date === currentDate) {
      currentGroup.push(tx);
    } else {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [tx];
      currentDate  = tx.date;
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);

  const result: AskariRow[] = [];
  for (const group of groups) {
    group.forEach((tx, i) => {
      result.push({
        ...tx,
        showDate:    i === 0,
        showBalance: i === group.length - 1,
      });
    });
  }
  return result;
};

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size:7.5pt; font-weight:bold; padding:3px 5px;
            border-top:2px solid #555; border-bottom:2px solid #555;
            vertical-align:middle; color:#000;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} text-align:left; padding-left:8px; border-left:2px solid #555; width:9.5%;">DATE</th>
      <th style="${TH} width:43.5%; text-align:left;">PARTICULARS</th>
      <th style="${TH} width:11%; text-align:center;">INS #/Time</th>
      <th style="${TH} width:14%; text-align:left;">VAL DATE</th>
      <th style="${TH} width:11%; text-align:left;">AMOUNT</th>
      <th style="${TH} border-right:2px solid #555; width:11%; text-align:right;">BALANCE</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
// Base style — padding-bottom is set per-row depending on group position
const TD_BASE = `${FONT} font-size:7pt; vertical-align:top; color:#000; line-height:1.2;`;

const fmtAmount = (tx: TransactionRow): string => {
  if (tx.debit)  return `${tx.debit}&nbsp;DB`;
  if (tx.credit) return tx.credit;
  return "";
};

const generateRow = (row: AskariRow): string => {
  const bold   = (row.isOpeningBalance || row.isClosingBalance) ? "font-weight:bold;" : "";
  // 8px bottom padding on last row of group; 2px for closing balance row and inner rows
  const pad    = (row.showBalance && !row.isClosingBalance) ? "padding:2px 5px 8px 5px;" : "padding:2px 5px 2px 5px;";
  // Bottom border only on last row of a date group (acts as group separator)
  const border = row.showBalance ? "border-bottom:1.5px solid #555;" : "border-bottom:none;";
  const TD     = `${TD_BASE} ${pad}`;
  const TD_NUM = `${TD} text-align:right;`;
  // Opening Balance: val date is always empty
  const valDate = row.isOpeningBalance ? "" : (row.valueDate || "");

  return `
  <tr>
    <td style="${TD} ${bold} ${border} border-left:2px solid #555;">${row.showDate ? row.date : ""}</td>
    <td style="${TD} ${bold} ${border}">${row.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD} ${bold} ${border} text-align:center;">${row.instNo || ""}</td>
    <td style="${TD} ${bold} ${border}">${valDate}</td>
    <td style="${TD} ${bold} ${border}">${fmtAmount(row)}</td>
    <td style="${TD_NUM} ${bold} ${border} border-right:2px solid #555;">${row.showBalance ? (row.balance || "") : ""}</td>
  </tr>`;
};

// ── iframe-based row height measurement ───────────────────────────────────────
// Measures inside a hidden iframe so the CSS context matches the preview HTML
// (no Tailwind / React-app styles leaking into measurements).
const IFRAME_STYLE =
  "position:fixed;top:0;left:-9999px;width:794px;height:10000px;border:none;visibility:hidden;pointer-events:none;z-index:-1;";

const iframeBaseHTML = (body: string) => `<!DOCTYPE html><html><head>
  <style>* { margin:0; padding:0; box-sizing:border-box; } body { font-family:Arial,sans-serif; }</style>
</head><body>${body}</body></html>`;

const measureRowHeights = (rows: AskariRow[]): Promise<number[]> =>
  new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = IFRAME_STYLE;
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(iframeBaseHTML(`
      <div style="padding:0 40px;">
        <table style="width:100%; border-collapse:collapse;">
          ${generateTableHeader()}
          <tbody>${rows.map(generateRow).join("")}</tbody>
        </table>
      </div>`));
    doc.close();
    // Double-RAF ensures fonts are rendered and layout is stable
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const trs = doc.querySelectorAll("tbody tr");
      const heights = Array.from(trs).map(
        (tr) => Math.ceil((tr as Element).getBoundingClientRect().height) + 1,
      );
      document.body.removeChild(iframe);
      resolve(heights);
    }));
  });

// ── Pagination ────────────────────────────────────────────────────────────────
const paginateByMeasuredHeight = (
  rows: AskariRow[],
  heights: number[],
  avail: number,
  availLast: number,
): AskariRow[][] => {
  const pages: AskariRow[][] = [];
  const remaining  = rows.slice();
  const remHeights = heights.slice();

  const fillPage = (limit: number): AskariRow[] => {
    const page: AskariRow[] = [];
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
    if (remTotal <= availLast) {
      pages.push(remaining.splice(0));
      break;
    }
    pages.push(fillPage(avail));
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
    <div style="margin-bottom:14px;">
      <img src="/askari-logo.png" alt="Askari Bank" style="height:38px; width:auto;" />
    </div>
    <div style="padding: 40px 20px; display:flex; justify-content:space-between; align-items:flex-start; ${FONT}">
      <!-- Left: Name + Address -->
      <div style="line-height:1.2;">
        <div style="display:flex; gap: 10px; margin-bottom: 8px;">
          <span style="font-size:8pt; font-weight:540; color:#313131; min-width:50px; text-align:right;">Name:</span>
          <span style="font-weight:bold; font-size:8.5pt;">${info.name}</span>
        </div>
        <div style="display:flex; align-items:flex-start; gap: 10px;">
          <span style="min-width:50px; text-align:right; color:#313131; font-size:8pt; font-weight:540;">Address:</span>
          <div>
            <div style="font-weight:bold; font-size:8.5pt;">${info.address1}</div>
            <div style="font-weight:bold; font-size:8.5pt;">${info.address2}</div>
            <div style="font-weight:bold; font-size:8.5pt;">${info.address3}</div>
            <div style="font-weight:bold; font-size:8.5pt;">${info.phone}</div>
          </div>
        </div>
      </div>
      <!-- Right: Branch, Period, Account -->
      <div style="min-width:330px; line-height:1.2;">
        <div style="color:#313131; font-size:8pt; font-weight:540;">Branch Code &amp; Branch Name</div>
        <div style="font-weight:bold; margin-bottom:8px; font-size:8.5pt;">${info.branchName}</div>
        <div style="color:#313131; font-size:8pt; font-weight:540;">STATEMENT PERIOD</div>
        <div style="font-weight:bold; margin-bottom:20px; font-size:8.5pt;">From: ${info.fromDate}&nbsp;&nbsp;To&nbsp;&nbsp;${info.toDate}</div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="color:#313131; font-size:8pt; font-weight:540;">ACCOUNT NUMBER</div>
            <div style="font-weight:bold; font-size:8.5pt;">${info.accountNumber}</div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:6px;">
            <div>
              <div style="font-weight:bold; font-size:8.5pt;">${info.currency}</div>
              <div style="font-weight:bold; font-size:8.5pt;">Askari Islamic</div>
              <div style="font-weight:bold; font-size:8.5pt;">${info.accountType}</div>
            </div>
            <div>
              <div style="font-size:8pt; font-weight:540;"><span style="font-weight:bold; font-size:8.5pt;">PAGE:</span>&nbsp;${pageNum} of ${totalPages}</div>
              <div style="font-size:8pt; font-weight:540;">Issued On</div>
              <div style="font-size:8pt; font-weight:540;">${info.issuedOn}</div>
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
const TF = `${FONT} font-size:7pt; vertical-align:top; color:#000; line-height:1.2; border: 1px solid #555; border-bottom: 2px solid #555; font-size:7pt; padding:0 5px; vertical-align:top; color:#000; font-weight:bold;`;

const generateTableFooter = (
  debitCount: number,
  creditCount: number,
  totalDebit: string,
  totalCredit: string,
) => `
<table style="width:100%; border-collapse:collapse;">
    <tr>
      <td style="${TF} width: 22%; white-space:nowrap; border-left: 2px solid #555;">TOTAL WITHDRAWALS</td>
      <td style="${TF} width: 10%; text-align:left; padding-left: 10px;">${debitCount}</td>
      <td style="${TF} width: 20%; text-align:right;">${totalDebit}</td>
      <td style="${TF} width: 18%; text-align:center; white-space:nowrap;">TOTAL DEPOSITS</td>
      <td style="${TF} width: 10%; text-align:left; padding-left: 10px;">${creditCount}</td>
      <td style="${TF} width: 20%; text-align:right; border-right: 2px solid #555;">${totalCredit}</td>
    </tr>
  </table>
`;

// ── NOTICE footer (every page) ────────────────────────────────────────────────
const generateNotice = () => `
  <div style="padding:4px 44px 20px 44px; flex-shrink:0;
              ${FONT} font-size:5.8pt; color:#000; line-height:1.25;">
    <div style="font-weight:bold; margin-bottom:1px;">
      <span style="color:#313131;">NOTICE : </span>Please report any discrepancy/error in this statement, in writing, within 60 days
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

// ── iframe-based measurement of static page sections ─────────────────────────
const measureStaticHeights = (
  info: AskariAccountInfo,
): Promise<{ headerPx: number; tblHdrPx: number; footerPx: number; tfootPx: number }> =>
  new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = IFRAME_STYLE;
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(iframeBaseHTML(`
      <div id="ms-hdr">${generateHeader(info, 1, 99)}</div>
      <div style="padding:0 40px;">
        <table style="width:100%; border-collapse:collapse;">
          ${generateTableHeader()}
        </table>
        <div id="ms-tf">${generateTableFooter(0, 0, "0.00", "0.00")}</div>
      </div>
      <div id="ms-ftr">${generateNotice()}</div>`));
    doc.close();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const headerPx = Math.ceil(doc.querySelector<HTMLElement>("#ms-hdr")!.getBoundingClientRect().height);
      const tblHdrPx = Math.ceil(doc.querySelector<HTMLElement>("thead tr")!.getBoundingClientRect().height);
      const tfootPx  = Math.ceil(doc.querySelector<HTMLElement>("#ms-tf")!.getBoundingClientRect().height);
      const footerPx = Math.ceil(doc.querySelector<HTMLElement>("#ms-ftr")!.getBoundingClientRect().height);
      document.body.removeChild(iframe);
      resolve({ headerPx, tblHdrPx, footerPx, tfootPx });
    }));
  });

// ── Main export ───────────────────────────────────────────────────────────────
export const generateAskariHTML = async (
  transactions: TransactionRow[],
  info: AskariAccountInfo,
): Promise<string> => {
  // Exclude any closing-balance rows that may come from Excel (we build it synthetically)
  const bodyTx = transactions.filter((tx) => !tx.isClosingBalance);

  // Build grouped display rows from regular transactions
  const displayRows = buildDisplayRows(bodyTx);

  // Closing balance = balance of the last body transaction
  const closingBalance = bodyTx[bodyTx.length - 1]?.balance ?? "";
  const closingDate    = bodyTx[bodyTx.length - 1]?.date    ?? "";

  // Append synthetic "** Closing Balance **" row to tbody (always its own group)
  const closingRow: AskariRow = {
    date: closingDate, particulars: "** Closing Balance **",
    instNo: "", valueDate: "", credit: "", debit: "",
    balance: closingBalance, isOpeningBalance: false, isClosingBalance: true,
    showDate: true, showBalance: true,
  };
  displayRows.push(closingRow);

  // Calculate totals — exclude opening balance from counts
  const regularTx   = bodyTx.filter((tx) => !tx.isOpeningBalance);
  const creditRows  = regularTx.filter((tx) => !!tx.credit);
  const debitRows   = regularTx.filter((tx) => !!tx.debit);
  const creditCount = creditRows.length;
  const debitCount  = debitRows.length;
  const totalCredit = fmt2dec(creditRows.reduce((s, tx) => s + parseAmt(tx.credit), 0));
  const totalDebit  = fmt2dec(debitRows.reduce((s, tx) => s + parseAmt(tx.debit),  0));

  // Measure actual section heights for accurate pagination (iframe = clean CSS context)
  const { headerPx, tblHdrPx, footerPx, tfootPx } = await measureStaticHeights(info);
  const avail     = A4_HEIGHT_PX - headerPx - tblHdrPx - footerPx - 4;
  const availLast = avail - tfootPx;

  const measuredHeights = await measureRowHeights(displayRows);
  const txPages    = paginateByMeasuredHeight(displayRows, measuredHeights, avail, availLast);
  const totalPages = txPages.length;

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;

    // position:absolute layout — header pinned top, notice pinned bottom, table fills middle
    return `
      <div style="position:relative; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        <div style="position:absolute; top:0; left:0; right:0;">
          ${generateHeader(info, pageNum, totalPages)}
        </div>
        <div style="position:absolute; top:${headerPx}px; bottom:${footerPx}px; left:0; right:0; overflow:hidden; padding:0 40px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
            </tbody>
          </table>
          ${isLastPage ? generateTableFooter(debitCount, creditCount, totalDebit, totalCredit) : ""}
        </div>
        <div style="position:absolute; bottom:0; left:0; right:0;">
          ${generateNotice()}
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
