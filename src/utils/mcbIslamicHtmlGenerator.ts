import { TransactionRow, McbIslamicAccountInfo } from "../types";
import { formatNumber } from "./faisalExcelParser";

// ── Palette ───────────────────────────────────────────────────────────────────
const FONT = "font-family: Arial, sans-serif;";
const BORDER = "2px solid #000";

// ── Pagination constants ──────────────────────────────────────────────────────
const A4_HEIGHT_PX = 1123;
const HEADER_PX = 90; // logo row + print date + branch row (every page, with buffer)
const ACCT_INFO_PX = 135; // account info panel + opening balance row (page 1 only)
const TBL_HEADER_PX = 38; // column header row (every page)
const BOTTOM_PX = 220; // totals row + summary table + footer text (last page, always reserved)
const ROW_HEIGHT_PX = 16; // transaction row height with buffer

// Full-page capacity (no bottom reserve — intermediate pages fill completely)
const AVAIL_P1 = A4_HEIGHT_PX - HEADER_PX - ACCT_INFO_PX - TBL_HEADER_PX;
const AVAIL_REST = A4_HEIGHT_PX - HEADER_PX - TBL_HEADER_PX;

// ── Pagination (two-pass) ──────────────────────────────────────────────────────
// Pass 1: fill every page to capacity (no BOTTOM_PX reserve).
// Pass 2: trim the final page so BOTTOM_PX (totals + summary + footer) fits.
const paginateTransactions = (rows: TransactionRow[]): TransactionRow[][] => {
  if (rows.length === 0) return [[]];

  const maxP1 = Math.floor(AVAIL_P1 / ROW_HEIGHT_PX);
  const maxRest = Math.floor(AVAIL_REST / ROW_HEIGHT_PX);

  const pages: TransactionRow[][] = [];
  let remaining = [...rows];

  pages.push(remaining.splice(0, maxP1));
  while (remaining.length > 0) {
    pages.push(remaining.splice(0, maxRest));
  }

  // Ensure the last page has room for the bottom section
  const lastIdx = pages.length - 1;
  const lastMax = Math.floor(
    ((lastIdx === 0 ? AVAIL_P1 : AVAIL_REST) - BOTTOM_PX) / ROW_HEIGHT_PX,
  );

  if (pages[lastIdx].length > lastMax) {
    const overflow = pages[lastIdx].splice(lastMax);
    pages.push(overflow);
  }

  return pages;
};

// ── Header (every page) ───────────────────────────────────────────────────────
const generatePageHeader = (
  info: McbIslamicAccountInfo,
  pageNum: number,
  totalPages: number,
) => `
  <div style="padding: 28px 28px 0 28px;">
    <!-- Row 1: Logo | Title+Dates | Logo2 -->
    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1px;">
    <div style="display: flex; align-items: start; gap: 60px;">
      <img src="/mab-islamic-logo.png" alt="MCB Islamic" style="height: 35px; width: 180px;" />
      <div style="text-align: center; font-family: 'Times New Roman', serif; color: #000; margin-top: 12px;">
        <div style="font-size: 14pt; font-weight: bold; color: #000;">Bank Statement</div>
        <div style="font-size: 9pt; margin-top: 1px;"><strong>From:</strong> ${info.fromDate} &nbsp;&nbsp; <strong>To:</strong> ${info.toDate}</div>
      </div>
      </div>
      <div>
      <img src="/mab-islamic-logo2.png" alt="MCB Islamic" style="height: 35px; width: 140px;" />
      <div style="${FONT} font-size: 7.5pt; text-align: right; font-weight: normal; margin-top: 2px;">
      ${info.printDate}
    </div>
    </div>
    </div>
    <!-- Print date -->
    
    <!-- Row 2: Branch | Page number -->
    <div style="display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 12px;">
      <div style="display: flex; flex-direction: column; ${FONT} font-size: 6.5pt;">
        <span><strong>Branch:</strong> ${info.branchCode}</span>
        <span style="padding-top: 2.5px; color: #444;">${info.branchName}</span>
      </div>
      <div style="${FONT} font-size: 7pt; padding-right: 28px;">Page ${pageNum} of ${totalPages}</div>
    </div>
  </div>
`;

// ── Account Info Section (page 1 only) ────────────────────────────────────────
const generateAccountInfo = (info: McbIslamicAccountInfo) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(info.qrText)}`;
  const LABEL = `${FONT} font-size: 7pt; color: #222; padding: 2px 0;`;
  const VALUE = `${FONT} font-size: 7pt; color: #333; padding: 2px 0;`;
  const ROW = `display: flex; gap: 6px; margin-bottom: 4px;`;

  return `
    <div style="display: flex; gap: 12px; padding: 10px 28px 8px 28px;">

      <!-- Left card: holder info -->
      <div style="width: 50%; border: 2px solid #000; padding: 4px 6px;">
        <div style="${ROW}">
          <span style="${LABEL}">Account Title:</span>
          <span style="${VALUE} font-weight: 580;">${info.accountTitle}</span>
        </div>
        <div style="flex; gap: 6px;">
          <span style="${LABEL}">Account Mailing Address:</span>
          <span style="${VALUE}">${info.mailingAddress}</span>
        </div>
        <div style="${ROW}">
          <span style="${LABEL}">${info.address2}</span>
          
        </div>
        <div style="${ROW} margin-top: 20px;">
          <span style="${LABEL}">Mobile No:</span>
          <span style="${VALUE}">${info.mobileNo}</span>
        </div>
      </div>

      <!-- Right card: account details + QR -->
      <div style="width: 50%; border: 2px solid #000; padding: 4px 4px 4px 12px; display: flex; align-items: flex-start; gap: 2px;">
        <div style="flex: 1;">
          <div style="${ROW}"><span style="${LABEL} width: 100px;">Account No:</span><span style="${VALUE}">${info.accountNo}</span></div>
          <div style="${ROW}"><span style="${LABEL} width: 100px;">IBAN:</span><span style="${VALUE}">${info.iban}</span></div>
          <div style="${ROW}"><span style="${LABEL} width: 100px;">Currency:</span><span style="${VALUE}">${info.currency}</span></div>
          <div style="${ROW}"><span style="${LABEL} width: 100px;">Type of Account:</span><span style="${VALUE}">${info.accountType}</span></div>
          <div style="${ROW}"><span style="${LABEL} width: 100px;">Date of Account Open:</span><span style="${VALUE}">${info.accountOpenDate}</span></div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 12px;">
          <img src="${qrUrl}" width="40" height="40" alt="QR Code" style="display: block;" />
          <div style="${FONT} margin-top: 8px; font-size: 6pt; text-align: center; color: #000; width: 80px;">${info.qrSubText}</div>
        </div>
      </div>

    </div>
  `;
};

// ── Opening balance row (page 1 only) ─────────────────────────────────────────
const generateOpeningBalanceRow = (info: McbIslamicAccountInfo) => `
  <div style="display: flex; justify-content: space-between; align-items: center;
              margin: 12px 28px 4px 28px; padding: 0px;
              background-color: #fff; ${FONT} font-size: 7.5pt;">
    <span style="font-weight: bold;">Opening Balance as of ${info.fromDate}</span>
    <span style="font-weight: bold;">${formatNumber(info.openingBalance)}</span>
  </div>
`;

// ── Table styles ──────────────────────────────────────────────────────────────
const TH = `${FONT} font-size: 5.5pt; font-weight: 580; padding: 4px 2px;
            background-color: #fff; color: #000; text-align: center; border: 2px solid #000;`;
const TD = `${FONT} font-size: 5.5pt; border: 2px solid #000; font-weight: 300; padding: 2px 2px;`;
const TD_NUM = `${TD} text-align: right;`;

// ── Table column headers ──────────────────────────────────────────────────────
const generateTableHeader = () => `
  <thead>
    <tr>
      <th style="${TH} width: 10%;">Tran Date</th>
      <th style="${TH} width: 40%;">Tran Description</th>
      <th style="${TH} width: 20%;">Ext . Reference No</th>
      <th style="${TH} width: 10%;">Debit</th>
      <th style="${TH} width: 10%;">Credit</th>
      <th style="${TH} width: 10%;">Balance</th>
    </tr>
  </thead>
`;

// ── Transaction row ───────────────────────────────────────────────────────────
const generateTransactionRow = (tx: TransactionRow, rowIndex: number) => {
  return `
  <tr>
    <td style="${TD} text-align: center;">${tx.date}</td>
    <td style="${TD}">${tx.particulars}</td>
    <td style="${TD}">${tx.extReference || ""}</td>
    <td style="${TD_NUM}">${tx.debit ? formatNumber(tx.debit) : ""}</td>
    <td style="${TD_NUM}">${tx.credit ? formatNumber(tx.credit) : ""}</td>
    <td style="${TD_NUM}">${formatNumber(tx.balance)}</td>
  </tr>
  `;
};

// ── Totals footer row (inside table, last page) ───────────────────────────────
const generateTotalsRow = (totalDebit: string, totalCredit: string) => `
  <tr>
    <td style="font-size: 5.5pt; font-weight: 300; padding: 4px 0px;"></td>
    <td style="font-size: 5.5pt; font-weight: 300; padding: 4px 0px;"></td>
    <td style="font-size: 5.5pt; font-weight: 300; padding: 4px 0px; font-weight: bold; text-align: right;">Total</td>
    <td style="font-size: 5.5pt; font-weight: 300; padding: 4px 0px; text-align: right;">${totalDebit}</td>
    <td style="font-size: 5.5pt; font-weight: 300; padding: 4px 0px; text-align: right;">${totalCredit}</td>
    <td style="font-size: 5.5pt; font-weight: 300; padding: 4px 0px;"></td>
  </tr>
`;

// ── Summary table (last page, below transaction table) ────────────────────────
const generateSummarySection = (
  info: McbIslamicAccountInfo,
  lastBalance: string,
  totalRows: number,
) => {
  const ST = `${FONT} font-size: 8pt; padding: 5px 0px; border: ${BORDER};`;
  const ST_VAL = `${ST} text-align: right; font-weight: bold;`;

  return `
    <div style="margin: 28px 28px 8px 28px;">
      <table style="width: 80%; border-collapse: collapse;">
        <tbody>
          <tr>
            <td style="${ST} width: 70%; padding-left: 10px">Current Balance as of ${info.fromDate}</td>
            <td style="${ST_VAL} width: 30%">${lastBalance}</td>
          </tr>
          <tr>
            <td style="${ST} width: 70%; padding-left: 10px">Amount in Reverse as of ${info.fromDate}</td>
            <td style="${ST_VAL} width: 30%">${formatNumber(info.amountInReverse)}</td>
          </tr>
          <tr>
            <td style="${ST} width: 70%; padding-left: 10px">Available Balance as of ${info.fromDate}</td>
            <td style="${ST_VAL} width: 30%">${formatNumber(info.availableBalance)}</td>
          </tr>
        </tbody>
      </table>
      <div style="${FONT} font-size: 5.5pt; font-weight: 580; color: #000; margin-top: 24px;">
      No Of Transactions: &nbsp; &nbsp; ${totalRows}
      </div>
    </div>
  `;
};

// ── Footer text (last page) ───────────────────────────────────────────────────
const generateFooterText = () => `
  <div style="margin: 10px 28px 0 28px;
              ${FONT} font-size: 6pt; color: #000;">
  <p style="line-height: 1.4; margin-bottom: 10px">Note: a) Uncollected Funds are not include in available balance and the same is reflected in the current balance. <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; b) This is a run time report and today's transactions may or may not be completed. <br />
     This statement of account will be considered correct unless a notice of exception is received by the bank within 15 days from the date of receipt of this statement. All correspondence relating to exception if any should be addressed to Complain Resolution Unit, Service Quality Division, MCB Islamic Bank Ltd. 1st Floor -- Plot # LM-10, Block 10-Am Gulshan-e-Iqbal, Main Rashid Minhas Road, Karachi or call our 24/7 MIB Phone Banking at 042-111-222-642 or lodge your complaint directly at our website www.mcbislamicbank.com</p>
  </div>
`;

// ── Main Layout ───────────────────────────────────────────────────────────────
export const generateMcbIslamicHTML = (
  transactions: TransactionRow[],
  info: McbIslamicAccountInfo,
): string => {
  const totalDebit = transactions.reduce(
    (sum, tx) => sum + (parseFloat(tx.debit.replace(/,/g, "")) || 0),
    0,
  );
  const totalCredit = transactions.reduce(
    (sum, tx) => sum + (parseFloat(tx.credit.replace(/,/g, "")) || 0),
    0,
  );
  const lastBalance =
    transactions.length > 0
      ? formatNumber(transactions[transactions.length - 1].balance)
      : "0.00";

  const pages = paginateTransactions(transactions);
  const totalPages = pages.length;
  const totalRows = transactions.length;

  const pagesHtml = pages.map((pageTxns, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === totalPages - 1;
    const pageNum = pageIndex + 1;

    const totalsHtml = isLastPage
      ? generateTotalsRow(
          formatNumber(String(totalDebit)),
          formatNumber(String(totalCredit)),
        )
      : "";

    const summaryHtml = isLastPage
      ? generateSummarySection(info, lastBalance, totalRows)
      : "";

    const footerHtml = isLastPage ? generateFooterText() : "";

    return `
      <div style="page-break-before: ${isFirstPage ? "auto" : "always"};">
        ${generatePageHeader(info, pageNum, totalPages)}
        ${isFirstPage ? generateAccountInfo(info) : ""}
        ${isFirstPage ? generateOpeningBalanceRow(info) : ""}
        <div style="padding: 0 28px;">
          <table style="width: 100%; border-collapse: collapse;" cellspacing="0">
            ${generateTableHeader()}
            <tbody>
              ${pageTxns.map((tx, i) => generateTransactionRow(tx, i)).join("")}
              ${totalsHtml}
            </tbody>
          </table>
        </div>
        ${summaryHtml}
        ${footerHtml}
      </div>
    `;
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
        <title>MCB Islamic Bank Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="width: 100%; max-width: 800px; margin: auto;">
          ${pagesHtml.join("")}
        </div>
      </body>
    </html>
  `;
};
