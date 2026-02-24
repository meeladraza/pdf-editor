import { TransactionRow, UBLAccountInfo } from "../types";
import { formatNumber } from "./excelParser";

const generateHeaderSection = (
  accountInfo: UBLAccountInfo,
  isFirstPage: boolean,
) => {
  const accountInfoDiv = `
    <div style="display: flex; justify-content: space-between; padding-right: 6pt; align-items: flex-start;">
      <div>
        <h2 style="padding-left: 3pt; text-indent: 0pt; line-height: 125%; text-align: left;">
          ${accountInfo.accountTitle}
        </h2>
        <p class="s1" style="padding-top: 2pt; padding-left: 3pt; text-indent: 0pt; text-align: left;">
          ${accountInfo.address1}
        </p>
        <p class="s1" style="padding-top: 1pt; padding-left: 3pt; text-indent: 0pt; line-height: 107%; text-align: left;">
          ${accountInfo.address2}
        </p>
        <p class="s1" style="padding-top: 1pt; padding-left: 3pt; text-indent: 0pt; line-height: 107%; text-align: left;">
          ${accountInfo.address3}
        </p>
        <p style="padding-top: 5pt; text-indent: 0pt; text-align: left"><br /></p>
        <h2 style="padding-left: 3pt; text-indent: 0pt; text-align: left;">
          <span>Reg Cell No :</span>
          <span style="padding-left: 12pt">${accountInfo.regCellNo}</span>
        </h2>
        <h2 style="padding-top: 1.5pt; padding-left: 3pt; text-indent: 0pt; text-align: left;">
          <span>IBAN No:</span>
          <span style="padding-left: 8pt">${accountInfo.ibanNo}</span>
          <span style="padding-left: 8pt">CIF#: <span>${accountInfo.cifNo}</span></span>
        </h2>
      </div>
      <div style="width: 293pt; border: 1.5pt solid black; padding-right: 7pt; padding-left: 7pt; padding-top: 2pt; padding-bottom: 16pt; background-color: white; display: flex;">
        <div style="width: 60%">
          <p style="margin-bottom: 1pt; font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold;">Statement Period</p>
          <p style="margin-bottom: 1pt; font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold;">Account No :</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">Account Type :</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">Product Type :</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">Currency :</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">Balance:</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">As of :</p>
        </div>
        <div style="width: 100%">
          <p style="margin-bottom: 1pt; font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold;">${accountInfo.statementPeriod}</p>
          <p style="margin-bottom: 1pt; font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold;">${accountInfo.accountNo}</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 11pt; font-weight: bold; line-height: 13px;">${accountInfo.accountType}</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 9pt; font-weight: bold; line-height: 13px;">${accountInfo.productType}</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 11pt; font-weight: bold; line-height: 13px;">${accountInfo.currency}</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">${accountInfo.balance}</p>
          <p style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; line-height: 13px;">${accountInfo.asOf}</p>
        </div>
      </div>
    </div>
  `;

  return `
    <img src="/ubl-header (1).png" alt="UB Header" style="width: 962px; max-width: 100%; height: auto; display: block; margin: 0 auto 6px;" />
    <h2 style="margin-top: -15px; padding-left: 3pt; text-indent: 43pt; line-height: 125%; text-align: left;">
      ${accountInfo.branchCode}
    </h2>
    ${isFirstPage ? accountInfoDiv : ""}
    ${isFirstPage ? `<p class="s2" style="padding-top: 1pt; padding-bottom: 2pt; text-indent: 0pt; text-align: right; padding-right: 83pt;">Account Statement</p>` : ""}
    ${!isFirstPage ? `<p class="s2" style="padding-top: 1pt; padding-bottom: 0pt; text-indent: 0pt; text-align: right; padding-right: 83pt; line-height: 8pt;">Account Statement</p>` : ""}
     ${!isFirstPage ? generateAccountHeaderDiv(accountInfo) : ""}
${isFirstPage ? `<p style="text-indent: 0pt; text-align: left"><br /></p>` : ""}
  `;
};

const generateAccountHeaderDiv = (accountInfo: UBLAccountInfo) => {
  return `
    <div style="width: 100%; display: flex; justify-content: space-between; padding-right: 6pt; padding-left: 3pt; padding-bottom: 4pt;">
      <span style="font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold;">
        ${accountInfo.accountTitle}
      </span>
      <span style="font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold; padding-right: 10pt;">
        ${accountInfo.accountNo}
      </span>
    </div>
  `;
};

const generateTableHeader = () => {
  return `
    <thead>
      <tr style="height: 18pt">
        <td style="width: 78pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;" bgcolor="#C1C1C1">
          <p class="s3" style="padding-right: 2pt; text-indent: 0pt; text-align: center;">Date</p>
        </td>
        <td style="width: 261pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;" bgcolor="#C1C1C1">
          <p class="s3" style="padding-right: 9pt; text-indent: 0pt; line-height: 12pt; text-align: center;">Particulars</p>
        </td>
        <td style="width: 72pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;" bgcolor="#C1C1C1">
          <p class="s3" style="padding-left: 17pt; text-indent: 0pt; text-align: left;">Inst No.</p>
        </td>
        <td style="width: 93pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;" bgcolor="#C1C1C1">
          <p class="s3" style="padding-left: 34pt; text-indent: 0pt; text-align: left;">Debit</p>
        </td>
        <td style="width: 95pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;" bgcolor="#C1C1C1">
          <p class="s3" style="text-indent: 0pt; text-align: center;">Credit</p>
        </td>
        <td style="width: 109pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;" bgcolor="#C1C1C1">
          <p class="s3" style="padding-right: 2pt; text-indent: 0pt; text-align: right;">Balance</p>
        </td>
      </tr>
    </thead>
  `;
};

const generateTransactionRow = (
  transaction: TransactionRow,
  isLastOnPage: boolean = false,
) => {
  const styleClass =
    transaction.isOpeningBalance || transaction.isClosingBalance ? "s3" : "s4";
  const particularsLines = transaction.particulars.split("\n");
  // Bottom border string applied only to the last row on a page
  const bb = isLastOnPage
    ? "border-bottom-style: solid; border-bottom-width: 1pt;"
    : "";

  let rowsHtml = "";

  for (let i = 0; i < particularsLines.length; i++) {
    const isFirstLine = i === 0;
    const isLastLine = i === particularsLines.length - 1;

    rowsHtml += `
      <tr style="height: ${isLastLine ? "12pt" : "13pt"}">
        ${
          isFirstLine
            ? `<td style="width: 78pt; border-left-style: solid; border-left-width: 1pt; ${bb} border-right-style: solid; border-right-width: 1pt;" ${
                particularsLines.length > 1
                  ? `rowspan="${particularsLines.length}"`
                  : ""
              }>
          <p class="${styleClass}" style="padding-left: 1pt; text-indent: 0pt; line-height: 11pt; text-align: left;">${
            transaction.date
          }</p>
        </td>`
            : ""
        }
        <td style="width: 261pt; border-left-style: solid; border-left-width: 1pt; ${isLastOnPage && isLastLine ? bb : ""} border-right-style: solid; border-right-width: 1pt;">
          <p class="${styleClass}" style="padding-left: 2pt; text-indent: 0pt; line-height: 11pt; text-align: left;">${
            particularsLines[i]
          }</p>
        </td>
        ${
          isFirstLine
            ? `<td style="width: 72pt; border-left-style: solid; border-left-width: 1pt; ${bb} border-right-style: solid; border-right-width: 1pt;" ${
                particularsLines.length > 1
                  ? `rowspan="${particularsLines.length}"`
                  : ""
              }>
          <p class="${styleClass}" style="text-indent: 0pt; line-height: 11pt; text-align: right;">${
            transaction.instNo
          }</p>
        </td>`
            : ""
        }
        ${
          isFirstLine
            ? `<td style="width: 93pt; border-left-style: solid; border-left-width: 1pt; ${bb} border-right-style: solid; border-right-width: 1pt;" ${
                particularsLines.length > 1
                  ? `rowspan="${particularsLines.length}"`
                  : ""
              }>
          <p class="${styleClass}" style="${
            transaction.debit ? "padding-left: 35pt;" : ""
          } text-indent: 0pt; line-height: 11pt; text-align: left;">${
            transaction.debit ? formatNumber(transaction.debit) : ""
          }</p>
        </td>`
            : ""
        }
        ${
          isFirstLine
            ? `<td style="width: 95pt; border-left-style: solid; border-left-width: 1pt; ${bb} border-right-style: solid; border-right-width: 1pt;" ${
                particularsLines.length > 1
                  ? `rowspan="${particularsLines.length}"`
                  : ""
              }>
          <p class="${styleClass}" style="text-indent: 0pt; line-height: 11pt; text-align: right;">${
            transaction.credit ? formatNumber(transaction.credit) : ""
          }</p>
        </td>`
            : ""
        }
        ${
          isFirstLine
            ? `<td style="width: 109pt; border-left-style: solid; border-left-width: 1pt; ${bb} border-right-style: solid; border-right-width: 1pt;" ${
                particularsLines.length > 1
                  ? `rowspan="${particularsLines.length}"`
                  : ""
              }>
          <p class="${styleClass}" style="padding-right: 2pt; text-indent: 0pt; line-height: 11pt; text-align: right;">${
            transaction.balance
          }</p>
        </td>`
            : ""
        }
      </tr>
    `;
  }

  return rowsHtml;
};

const generateTotalsTable = (transactions: TransactionRow[]) => {
  let totalDebit = 0;
  let totalCredit = 0;
  let transactionCount = 0;

  transactions.forEach((tx) => {
    if (!tx.isOpeningBalance && !tx.isClosingBalance) {
      if (tx.debit) {
        const debitNum = parseFloat(String(tx.debit).replace(/,/g, ""));
        if (!isNaN(debitNum)) totalDebit += debitNum;
      }
      if (tx.credit) {
        const creditNum = parseFloat(String(tx.credit).replace(/,/g, ""));
        if (!isNaN(creditNum)) totalCredit += creditNum;
      }
      transactionCount++;
    }
  });

  return `
    <tfoot>
      <tr style="height: 39pt">
        <td style="width: 339pt; border-top-style: solid; border-top-width: 1pt; border-left-style: solid; border-left-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt;" colspan="2">
          <p class="s3" style="padding-top: 6pt; padding-left: 72pt; padding-right: 94pt; text-indent: 0pt; line-height: 118%; text-align: left;">
            Total Withdrawals &amp; Total Deposits Total number of Transactions
          </p>
        </td>
        <td style="width: 72pt; border-top-style: solid; border-top-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt;">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 93pt; border-top-style: solid; border-top-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt;">
          <p class="s5" style="padding-top: 3pt; padding-right: 2pt; text-indent: 0pt; text-align: right;">${formatNumber(
            totalDebit,
          )}</p>
          <p class="s5" style="padding-top: 6pt; padding-right: 1pt; text-indent: 0pt; text-align: right;">${transactionCount}</p>
        </td>
        <td style="width: 95pt; border-top-style: solid; border-top-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt;">
          <p class="s5" style="padding-top: 3pt; text-indent: 0pt; text-align: right;">${formatNumber(
            totalCredit,
          )}</p>
        </td>
        <td style="width: 109pt; border-top-style: solid; border-top-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
    </tfoot>
  `;
};

const generateFooter = (pageNum: number, totalPages: number) => {
  return `
    <div style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%; z-index: 1;">
      <p style="position: absolute; bottom: 80pt; left: 4pt; width: 80%; text-indent: 0pt; line-height: 87%; text-align: left; font-family: Arial, sans-serif; font-size: 9pt;">
        Note: The items and balance shown on this statement should be verified and the branch manager notified within 2 weeks of any discrepancies, otherwise it will be assumed as correct.
      </p>
      <h2 style="position: absolute; right: 20pt; bottom: 110pt; text-indent: 0pt; text-align: right; font-size: 10pt;">
        Page # ${pageNum} / ${totalPages}
      </h2>
      <img src="/footer (1).png" alt="UB Footer" style="width: 100%; height: auto; display: block; margin: 0; z-index: 1;" />
    </div>
  `;
};

// A4 page height in effective CSS pt for a 962px-wide content wrapper.
// Chromium scales 962px content to fit A4 width (595pt), scale ≈ 0.825.
// Effective page height = 842pt / 0.825 ≈ 1021pt.
const A4_HEIGHT_PT = 1021;
// Space reserved at the bottom for footer (matches margin-bottom: 120pt on table div)
const FOOTER_RESERVED_PT = 120;
// Tfoot totals row height (only on last page)
const TFOOT_HEIGHT_PT = 39;

// Estimated overhead height per page type (header + table header)
// First page: logo image ~60pt + branch code ~18pt + account info box ~120pt +
//             "Account Statement" text ~30pt + br spacer ~13pt + table header 18pt
const FIRST_PAGE_HEADER_PT = 259;
// Subsequent pages: logo ~60pt + branch code ~18pt + title/no row ~22pt +
//                   "Account Statement" ~15pt + table header 18pt
const OTHER_PAGE_HEADER_PT = 133;

// Available height for transaction rows on each page type
const FIRST_PAGE_ROWS_PT =
  A4_HEIGHT_PT - FIRST_PAGE_HEADER_PT - FOOTER_RESERVED_PT - TFOOT_HEIGHT_PT;
const OTHER_PAGE_ROWS_PT =
  A4_HEIGHT_PT - OTHER_PAGE_HEADER_PT - FOOTER_RESERVED_PT - TFOOT_HEIGHT_PT;

// Each particulars line height in pt (matches tr height: 13pt / 12pt)
const ROW_LINE_PT = 13;
const ROW_LAST_LINE_PT = 12;

const getTransactionRowHeight = (transaction: TransactionRow): number => {
  const lineCount = transaction.particulars.split("\n").length;
  return (lineCount - 1) * ROW_LINE_PT + ROW_LAST_LINE_PT;
};

const paginateTransactions = (
  transactions: TransactionRow[],
): TransactionRow[][] => {
  const pages: TransactionRow[][] = [];
  let currentPage: TransactionRow[] = [];
  let currentHeight = 0;
  let availableHeight = FIRST_PAGE_ROWS_PT;

  for (const tx of transactions) {
    const rowHeight = getTransactionRowHeight(tx);
    if (currentHeight + rowHeight > availableHeight && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
      availableHeight = OTHER_PAGE_ROWS_PT;
    }
    currentPage.push(tx);
    currentHeight += rowHeight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[]];
};

const generatePageContent = (
  transactions: TransactionRow[],
  accountInfo: UBLAccountInfo,
  isFirstPage: boolean,
  pageNum: number,
  totalPages: number,
): string => {
  const tableHeader = generateTableHeader();

  let tableRows = "";
  transactions.forEach((tx, idx) => {
    const isLastOnPage = idx === transactions.length - 1;
    tableRows += generateTransactionRow(tx, isLastOnPage);
  });

  const totalsTableContent =
    pageNum === totalPages ? generateTotalsTable(transactions) : "";

  return `
    <div style="page-break-before: ${isFirstPage ? "auto" : "always"}; position: relative; min-height: 100vh; display: flex; flex-direction: column;">
      ${generateHeaderSection(accountInfo, isFirstPage)}
      <div style="padding-left: 3pt; padding-right: 6pt; flex-grow: 1; margin-bottom: 120pt; z-index: 4;">
        <table style="width: 100%; border-collapse: collapse;" cellspacing="0">
          ${tableHeader}
          <tbody>
            ${tableRows}
          </tbody>
          ${totalsTableContent}
        </table>
      </div>
      ${generateFooter(pageNum, totalPages)}
    </div>
  `;
};

export const generateUBLHTML = (
  allTransactions: TransactionRow[],
  accountInfo: UBLAccountInfo,
): string => {
  const pages = paginateTransactions(allTransactions);

  const totalPages = Math.max(1, pages.length);

  // Generate pages
  let pagesHtml = pages
    .map((pageTransactions, index) =>
      generatePageContent(
        pageTransactions,
        accountInfo,
        index === 0,
        index + 1,
        totalPages,
      ),
    )
    .join("");

  const styles = `
    @page { 
      margin: 0; 
      size: A4; 
    }
    @media print {
      body { 
        margin: 0; 
        padding: 0; 
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      thead {
        display: table-header-group;
      }
      tfoot {
        display: table-footer-group;
      }
      tr {
        page-break-inside: avoid;
      }
    }
    body { 
      margin: 0; 
      padding: 0; 
    }
    * { 
      margin: 0; 
      padding: 0; 
      text-indent: 0; 
    }
    h2 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: bold; 
      text-decoration: none; 
      font-size: 10pt; 
    }
    .s1 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: normal; 
      text-decoration: none; 
      font-size: 10pt; 
    }
    h1 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: bold; 
      text-decoration: none; 
      font-size: 11pt; 
    }
    .s2 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: normal; 
      text-decoration: none; 
      font-size: 20pt; 
    }
    .s3 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: bold; 
      text-decoration: none; 
      font-size: 11pt; 
    }
    .s4 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: normal; 
      text-decoration: none; 
      font-size: 11pt; 
    }
    .s5 { 
      color: black; 
      font-family: "Times New Roman", serif; 
      font-style: normal; 
      font-weight: normal; 
      text-decoration: none; 
      font-size: 10pt; 
    }
    p { 
      color: black; 
      font-family: Arial, sans-serif; 
      font-style: normal; 
      font-weight: bold; 
      text-decoration: none; 
      font-size: 9pt; 
      margin: 0pt; 
    }
    table, tbody { 
      vertical-align: top; 
      overflow: visible; 
    }
  `;

  return `
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>UBL Bank Statement</title>
        <style type="text/css">${styles}</style>
      </head>
      <body>
        <div style="width: 962px; margin: auto;">
          ${pagesHtml}
        </div>
      </body>
    </html>
  `;
};
