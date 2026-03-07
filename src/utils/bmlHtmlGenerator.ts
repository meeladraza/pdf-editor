import { TransactionRow, BMLAccountInfo } from "../types";

const FONT = "font-family: Arial, sans-serif;";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX    = 1123;
const P1_TOP_PX       = 360;  // logo + branch + account section + period line + opening bal
const REST_TOP_PX     = 360;  // logo + branch + account section + period line
const TBL_HDR_PX      = 30;
const FOOTER_PX       = 60;
const DISCLAIMER_PX   = 160; // last transaction page only

const AVAIL_P1        = A4_HEIGHT_PX - P1_TOP_PX   - TBL_HDR_PX - FOOTER_PX;
const AVAIL_REST      = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - FOOTER_PX;
const AVAIL_LAST_ONLY = A4_HEIGHT_PX - REST_TOP_PX  - TBL_HDR_PX - DISCLAIMER_PX - FOOTER_PX;
const AVAIL_P1_LAST   = A4_HEIGHT_PX - P1_TOP_PX    - TBL_HDR_PX - DISCLAIMER_PX - FOOTER_PX;

// ── Table header ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size: 8pt; font-weight: normal; background: #b9d3e2;
            padding: 2px; border: 1px solid #73a3c3; text-align: center; vertical-align: top; color: #000; line-height: 1.2;`;

const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width:11%;">Date</th>
      <th style="${TH} width:11%;">Value Date</th>
      <th style="${TH} width:36%;">Particulars</th>
      <th style="${TH} width:10%;">Instrument</th>
      <th style="${TH} width:11%;">Debit</th>
      <th style="${TH} width:11%;">Credit</th>
      <th style="${TH} width:10%;">Day-end<br>Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const TD     = `${FONT} font-size: 8pt; padding: 2px; border: 1px solid #e5e5e5; vertical-align: top; color: #000; line-height: 1.2;`;
const TD_NUM = `${TD} text-align: right;`;

const generateRow = (tx: TransactionRow) => {
  const bold = (tx.isOpeningBalance || tx.isClosingBalance) ? "font-weight:bold;" : "";
  return `
  <tr>
    <td style="${TD} ${bold} text-align:center;">${tx.date}</td>
    <td style="${TD} ${bold} text-align:center;">${tx.valueDate || ""}</td>
    <td style="${TD} ${bold}">${tx.particulars.replace(/\n/g, "<br>")}</td>
    <td style="${TD} ${bold} text-align:center;">${tx.instNo || ""}</td>
    <td style="${TD_NUM} ${bold}">${tx.debit || ""}</td>
    <td style="${TD_NUM} ${bold}">${tx.credit || ""}</td>
    <td style="${TD_NUM} ${bold}">${tx.balance || ""}</td>
  </tr>`;
};

// ── Closing balance tfoot (last transaction page) ─────────────────────────────
const generateClosingRow = (closingBalance: string) => `
  <tfoot>
    <tr>
      <td colspan="4" style="${FONT} font-size:8pt; padding:2px 0px; text-align:right;">
        Closing Balance -->
      </td>
      <td></td>
      <td style="${FONT} font-size:8pt; font-weight:bold; padding:2px 4px; text-align:right;">
        ${closingBalance}
      </td>
      <td></td>
    </tr>
  </tfoot>
`;

// ── DOM-based row height measurement ─────────────────────────────────────────
const measureRowHeights = (rows: TransactionRow[]): number[] => {
  const container = document.createElement("div");
  container.style.cssText =
    "position:absolute; top:-9999px; left:-9999px; width:674px; visibility:hidden;";
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

// ── Full page header (transaction pages) ──────────────────────────────────────
const generateHeader = (
  info: BMLAccountInfo,
  isFirstPage: boolean,
) => `
  <div style="padding: 60px 60px 0 60px;">
    <!-- Logo row -->
    <div style="margin-bottom:28px;">
      <img src="/bml-logo.png" alt="BML" style="height:50px; width:auto;" />

    </div>
    <!-- Branch info -->
    <div style="${FONT} margin-bottom:20px;">
      <div style="font-size:8pt; font-weight:bold; margin-bottom: 2px;">${info.branchName}</div>
      <div style="font-size: 8pt; color:#000;">${info.branchAddress}</div>
    </div>
    <!-- Account holder (left) + Account info (right) -->
    <div style="display:flex; justify-content:space-between; ${FONT} font-size:9pt; margin:8px 0 60px 0;">
      <div style="font-weight:800; line-height:1.2;">
        <div>${info.accountTitle}</div>
        <div>${info.address1}</div>
        <div>${info.address2}</div>
        <div>${info.address3}</div>
        <div>Ref # ${info.refNo}</div>
      </div>
      <div style="font-weight: 800; line-height:1.2; text-align:left; min-width:280px;">
        <div>A/c # ${info.accountNo}</div>
        <div>IBAN # : ${info.iban}</div>
        <div>A/c Product : ${info.acProduct}</div>
        <div>Currency : ${info.currency}</div>
        <div>Old Account #${info.oldAccountNo}</div>
      </div>
    </div>
    <!-- Statement period -->
    <div style="${FONT} font-size:8pt; margin-bottom:2px; margin-top:6px;">
      Account Statement For The Period Of ${info.fromDate} To ${info.toDate}
    </div>
    <hr style="border:0; border-top:1px solid #000; margin:0 0 4px 0;" />
    ${isFirstPage ? `
    <!-- Opening balance (page 1 only) -->
    <div style="display:flex; justify-content:flex-end; ${FONT} font-size:8pt; padding:3px 0 2px 0; border-bottom: 1px solid #000; margin-bottom: 2px;">
      <span style="margin-right:65px;">Opening Balance --></span>
      <span style="font-weight:bold; min-width:120px; text-align: left;">${info.openingBalance}</span>
    </div>` : ""}
  </div>
`;

// ── Simple header (disclaimer page only: logo + branch, no account info) ──────
const generateSimpleHeader = (info: BMLAccountInfo) => `
  <div style="padding: 60px 60px 0 60px;">
    <!-- Logo row -->
    <div style="margin-bottom:28px;">
      <img src="/bml-logo.png" alt="BML" style="height:50px; width:auto;" />

    </div>
    <!-- Branch info -->
    <div style="${FONT} margin-bottom:20px;">
      <div style="font-size:8pt; font-weight:bold; margin-bottom: 2px;">${info.branchName}</div>
      <div style="font-size: 8pt; color:#000;">${info.branchAddress}</div>
    </div>
  </div>
`;

// ── Partial disclaimer (bottom of last transaction page, items 1-4 truncated) ─
const generatePartialDisclaimer = () => `
  <div style="${FONT} font-size: 7pt; color:#000; padding: 8px 60px 0 60px; line-height:1.2;">
    <p style="margin-bottom:8px;">1. Any discrepancy in the account statement should be notified within 45 days of receipt of the statement. In case we do not hear from you in writing, within 45 days, we shall consider all transactions appearing therein and the balance to be in order.</p>
    <p style="margin-bottom:8px;">2. Our schedule of charges, in force for the period, is available with all the branches and on our website (www.bankmakramah.com). Please obtain your copy from your branch or directly download from our website www.bankmakramah.com</p>
    <p style="margin-bottom:8px;">3. Please provide an ATTESTED copy of valid CNIC/ID/present the original CNIC/ID with copy for attestation by Bank's officials, in order to continue enjoying uninterrupted services. Please ignore this message if your updated and valid CNIC/ID is already available with us.</p>
    <p>4. The bank has a policy of designating an account dormant, in case there is no customer initiated activity for a period of One Year. Under SBP instructions, no any</p>
  </div>
`;

// ── Full disclaimer continuation page (dedicated last page) ───────────────────
const generateDisclaimerPage = (
  info: BMLAccountInfo,
  pageNum: number,
  totalPages: number,
) => `
  <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden; page-break-before:always;">
    ${generateSimpleHeader(info)}
    <div style="${FONT} font-size: 7pt; color:#000; padding: 8px 60px 0 60px; line-height:1.2;">
      <p style="margin-bottom:4px;">debit/withdrawal transactions shall be entertained in a dormant/inactive account. If the account becomes dormant, please approach your branch along with your original valid CNIC/ID, for activation. In the interest of our customers, we place certain restrictions on the account, as part of caution. We, therefore, request you to keep your account active.</p>
      <p style="margin-bottom:4px; margin-top: 8px;">5. In case any particular of account (address, profession, telephone no. etc) has changed, please inform the bank in writing duly signed by authorized signatory (ies).</p>
      <p style="margin-bottom:4px; margin-top: 8px;">6. As per current policy of the Bank, copy of terms and conditions for account and services has already been dispatched to you along with letter of thanks. If for any reason, the copy of updated terms and conditions is not available with you, the same can be downloaded from our website www.bankmakramah.com or you may contact our Branch / Contact Center for onward dispatch to you.</p>
      <p style="margin-bottom:4px; margin-top: 8px;">7. We are pleased to inform you that your International Banking Account Number (IBAN) has been allocated and printed below the account number on the top right corner of the statement of account. It helps to uniquely identify the account holders across all banks locally and worldwide. You may use your IBAN for International and Local transactions. For your convenience, your IBAN information is also available on our Bank's website: www.bankmakramah.com and call center at 021-111-124365.</p>
      <p style="margin-bottom:4px; font-weight:bold; margin-top: 8px;">8. Unclaimed Deposit: A deposit / instrument, which remain inoperative for a period for fifteen years, shall become unclaimed and will be surrendered to State Bank of Pakistan as per the Provision of BCO, 1962.</p>
      <p style="margin-bottom:4px; margin-top: 8px;">9. In order to secure your interest &amp; discourage wrong practices, the State Bank of Pakistan (SBP) has issued the directives that biometric verification is a mandatory requirement for all account holders, including person(s) allowed to open and operate the account. Therefore, you are requested to visit Bank Makramah Branch where our dedicated team is waiting to complete Biometric Verification of all your account(s), if not performed previously.</p>
      <p style="margin-bottom:4px; margin-top: 8px;">10. As per SBP PSD Circular No. 09 of 2018- Security of Digital Banking, with effect from January 01, 2019, Bank Makramah will be sending free of cost transaction alerts to our customers through both SMS and email for all international and domestic digital transactions including but not limited to ATM, POS and Internet banking transactions. For this purpose, you are requested to visit Bank Makramah Branch and provide your registered mobile number, mailing address &amp; valid email address, if not provided previously.</p>
      <p style="margin-bottom:8px; margin-top: 8px; font-weight:bold;">11. If you are not satisfied with our response to your complaint or for complaints which remain unattended / unresolved beyond 30 days, you may then approach to Banking Mohtasib Pakistan, Shaheen Complex, M.R. Kiyani Road, Karachi, Pakistan or visit www.bankingmohtasib.gov.pk.</p>
      <p style="margin-bottom:4px; margin-top: 8px; font-weight: bold;direction:rtl; text-align:right; width: fit-content; margin: 0 auto;">اگر آپ اپنی شکایت کے جواب سے مطمئن نہیں یا ہماری طرف سے آپ کو کوئی جواب ۳۰ دنوں تک نہیں دیا گیا/<br>شکایت غیرتصفیہ شدہ ربی تو آپ بینکنگ محتسب شاہین رود کراچی، پاکستان سے رجوع کر سکتے ہیں یا<br>ویب سائٹ <span style="text-decoration: underline; color: #0000FF;" dir="ltr">www.bankingmohtasib.gov.pk</span> نیکھ سکتے ہیں.</p>
      <p style="margin-top:12px; text-align:center;">This account statement is computer generated and does not carry any signature.</p>
    </div>
    <div style="flex:1;"></div>
    <div style="flex-shrink:0;">
      ${generateFooter(pageNum, totalPages, info.runBy)}
    </div>
  </div>
`;

// ── Footer (every page) ───────────────────────────────────────────────────────
const generateFooter = (pageNum: number, totalPages: number, runBy: string) => `
  <div style="display:flex; align-items:center; flex-shrink:0;
              padding: 20px 60px 40px 60px; ${FONT} font-size:7pt; color:#000;">
    <span style="width:85%; text-align:center;">${pageNum} of ${totalPages}</span>
    <span style="width:15%;">Run By : ${runBy}</span>
  </div>
`;

// ── Main export ───────────────────────────────────────────────────────────────
export const generateBMLHTML = async (
  transactions: TransactionRow[],
  info: BMLAccountInfo,
): Promise<string> => {
  const measuredHeights = measureRowHeights(transactions);
  const txPages    = paginateByMeasuredHeight(transactions, measuredHeights);
  const totalPages = txPages.length + 1; // +1 for dedicated disclaimer page

  // Take closing balance from the last row's balance column
  const lastPageRows   = txPages[txPages.length - 1];
  const lastRow        = lastPageRows[lastPageRows.length - 1];
  const closingBalance = lastRow?.balance ?? "";

  const pagesHtml = txPages.map((rows, idx) => {
    const isFirstPage = idx === 0;
    const isLastPage  = idx === txPages.length - 1;
    const pageNum     = idx + 1;

    return `
      <div style="display:flex; flex-direction:column; height:${A4_HEIGHT_PX}px; overflow:hidden;
                  page-break-before:${isFirstPage ? "auto" : "always"};">
        ${generateHeader(info, isFirstPage)}
        <div style="padding:0 60px 4px 60px;">
          <table style="width:100%; border-collapse:collapse;">
            ${generateTableHeader()}
            <tbody>
              ${rows.map(generateRow).join("")}
            </tbody>
            ${isLastPage ? generateClosingRow(closingBalance) : ""}
          </table>
        </div>
        ${isLastPage ? generatePartialDisclaimer() : ""}
        <div style="flex:1;"></div>
        <div style="flex-shrink:0;">
          ${generateFooter(pageNum, totalPages, info.runBy)}
        </div>
      </div>`;
  });

  // Dedicated disclaimer continuation page
  const disclaimerPage = generateDisclaimerPage(info, totalPages, totalPages);

  const styles = `
    @page { margin: 0; size: A4; }
    @media print { body { margin: 0; padding: 0; } tr { page-break-inside: avoid; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; }
    tbody tr:last-child td { border-bottom: 1px solid #aaa; }
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Bank Makramah Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width:100%; max-width:800px; margin:auto;">
          ${pagesHtml.join("")}
          ${disclaimerPage}
        </div>
      </body>
    </html>
  `;
};
