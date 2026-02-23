import { TransactionRow, UBLAccountInfo } from "../types";
import { formatNumber } from "./excelParser";

const FIRST_PAGE_MAX_HEIGHT = 680;
const OTHER_PAGE_MAX_HEIGHT = 620;
const ROW_HEIGHT_BASE = 13;
const ROW_HEIGHT_LAST_LINE = 12;
const TABLE_HEADER_HEIGHT = 18;

const calculateTransactionHeight = (transaction: TransactionRow): number => {
  const particularsLines = transaction.particulars.split("\n");
  if (particularsLines.length === 1) {
    return ROW_HEIGHT_BASE;
  }
  return (particularsLines.length - 1) * ROW_HEIGHT_BASE + ROW_HEIGHT_LAST_LINE;
};

const generateHeaderSection = (
  accountInfo: UBLAccountInfo,
  isFirstPage: boolean
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
    <h2 style="margin-top: -15px; padding-left: 3pt; text-indent: 43pt; line-height: 125%; text-align: left;">
      ${accountInfo.branchCode}
    </h2>
    ${isFirstPage ? accountInfoDiv : ""}
    <p class="s2" style="padding-top: 1pt; padding-bottom: 2pt; text-indent: 0pt; text-align: right; padding-right: 83pt;">Account Statement</p>
    <p style="text-indent: 0pt; text-align: left"><br /></p>
  `;
};

const generateTableHeader = () => {
  return `
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
        <p class="s3" style="padding-left: 36pt; text-indent: 0pt; text-align: left;">Balance</p>
      </td>
    </tr>
  `;
};

const generateTransactionRow = (transaction: TransactionRow) => {
  const styleClass =
    transaction.isOpeningBalance || transaction.isClosingBalance ? "s3" : "s4";
  const particularsLines = transaction.particulars.split("\n");

  let rowsHtml = "";

  for (let i = 0; i < particularsLines.length; i++) {
    const isFirstLine = i === 0;
    const isLastLine = i === particularsLines.length - 1;

    rowsHtml += `
      <tr style="height: ${isLastLine ? "12pt" : "13pt"}">
        ${
          isFirstLine
            ? `<td style="width: 78pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;" ${
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
        <td style="width: 261pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;">
          <p class="${styleClass}" style="padding-left: 2pt; text-indent: 0pt; line-height: 11pt; text-align: left;">${
      particularsLines[i]
    }</p>
        </td>
        ${
          isFirstLine
            ? `<td style="width: 72pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;" ${
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
            ? `<td style="width: 93pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;" ${
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
            ? `<td style="width: 95pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;" ${
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
            ? `<td style="width: 109pt; border-left-style: solid; border-left-width: 1pt; border-right-style: solid; border-right-width: 1pt;" ${
                particularsLines.length > 1
                  ? `rowspan="${particularsLines.length}"`
                  : ""
              }>
          <p class="${styleClass}" style="padding-left: 45pt; text-indent: 0pt; line-height: 11pt; text-align: left;">${
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
    <table style="border-collapse: collapse; margin-top: 1pt;">
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
            totalDebit
          )}</p>
          <p class="s5" style="padding-top: 6pt; padding-right: 1pt; text-indent: 0pt; text-align: right;">${transactionCount}</p>
        </td>
        <td style="width: 95pt; border-top-style: solid; border-top-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt;">
          <p class="s5" style="padding-top: 3pt; text-indent: 0pt; text-align: right;">${formatNumber(
            totalCredit
          )}</p>
        </td>
        <td style="width: 109pt; border-top-style: solid; border-top-width: 1pt; border-bottom-style: solid; border-bottom-width: 1pt; border-right-style: solid; border-right-width: 1pt;">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
    </table>
  `;
};

const generateFooter = (pageNum: number, totalPages: number) => {
  return `
    <div class="footer">
      <div>
        <p style="width: 70%; padding-left: 4pt; text-indent: 0pt; line-height: 87%; text-align: left; font-size: 9pt;">
          Note: The items and balance shown on this statement should be verified and the branch manager notified within 2 weeks of any discrepancies, otherwise it will be assumed as correct.
        </p>
        <h2 style="text-indent: 0pt; text-align: right; font-size: 10pt; margin-top: 6pt;">
          Page # ${pageNum} / ${totalPages}
        </h2>
      </div>
    </div>
  `;
};

export const generateUBLHTML = (
  transactions: TransactionRow[],
  accountInfo: UBLAccountInfo
): string => {
  const pages: TransactionRow[][] = [];
  let currentPageTransactions: TransactionRow[] = [];
  let currentHeight = 0;
  let isFirstPage = true;

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    const transactionHeight = calculateTransactionHeight(transaction);
    const maxHeight = isFirstPage
      ? FIRST_PAGE_MAX_HEIGHT
      : OTHER_PAGE_MAX_HEIGHT;

    if (
      currentHeight + transactionHeight > maxHeight &&
      currentPageTransactions.length > 0
    ) {
      pages.push([...currentPageTransactions]);
      currentPageTransactions = [];
      currentHeight = TABLE_HEADER_HEIGHT;
      isFirstPage = false;
    }

    currentPageTransactions.push(transaction);
    currentHeight += transactionHeight;
  }

  if (currentPageTransactions.length > 0) {
    pages.push(currentPageTransactions);
  }

  const totalPages = pages.length;
  const htmlPages: string[] = [];

  pages.forEach((pageTransactions, pageIndex) => {
    const isFirst = pageIndex === 0;
    const isLast = pageIndex === totalPages - 1;
    const pageNum = pageIndex + 1;

    const headerSection = generateHeaderSection(accountInfo, isFirst);
    const tableHeader = generateTableHeader();

    let tableRows = "";
    pageTransactions.forEach((tx) => {
      tableRows += generateTransactionRow(tx);
    });

    const totalsTable = isLast ? generateTotalsTable(transactions) : "";
    const footer = generateFooter(pageNum, totalPages);

    const pageHtml = `
      <div class="page" style="position: relative; width: 210mm; margin: 0 auto; page-break-after: always; background-color: white;">
        <div class="page-content" style="position: relative; width: calc(210mm - 24mm); margin: 12mm auto; z-index: 2; min-height: 257mm;">
          ${headerSection}
          <div style="padding-left: 3pt; padding-right: 6pt">
            <table style="border-collapse: collapse; width: 100%;" cellspacing="0">
              ${tableHeader}
              ${tableRows}
            </table>
            ${totalsTable}
          </div>
        </div>
        ${footer}
      </div>
    `;

    htmlPages.push(pageHtml);
  });

    const styles = `
    @page { size: A4; margin: 12mm; }
    * { margin: 0; padding: 0; text-indent: 0; box-sizing: border-box; }
    html, body { height: 100%; background-color: #f2f2f2; }
    .page { box-shadow: none; }
    .page, .page-content { font-family: "Times New Roman", serif; color: #000; }
    h2 { font-weight: bold; font-size: 10pt; margin: 0 0 4px 0; }
    .s1 { font-weight: normal; font-size: 10pt; }
    h1 { font-weight: bold; font-size: 11pt; }
    .s2 { font-weight: normal; font-size: 20pt; }
    .s3 { font-weight: bold; font-size: 11pt; }
    .s4 { font-weight: normal; font-size: 11pt; }
    .s5 { font-weight: normal; font-size: 10pt; }
    p { font-family: "Times New Roman", serif; font-size: 9pt; margin: 0; }
    table, tbody { vertical-align: top; overflow: visible; }
    /* footer placement: keep inside page margins */
    .footer { position: absolute; left: 12mm; right: 12mm; bottom: 12mm; }
    @media print { .page-break { page-break-after: always; } }
  `;

  return `
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>UBL Bank Statement</title>
        <style type="text/css">${styles}</style>
      </head>
      <body>
        ${htmlPages.join("")}
      </body>
    </html>
  `;
};
