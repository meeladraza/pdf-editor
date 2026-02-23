import { FaisalTransactionRow, FaisalAccountInfo } from "../types";
import { formatNumber } from "./faisalExcelParser";

const generateHeader = (accountInfo: FaisalAccountInfo) => {
  return `
    <div style="padding: 20px 30px; border-bottom: 2px solid #003366;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <h1 style="font-size: 32px; color: #003366; margin: 0; font-family: Arial, sans-serif; font-weight: bold;">faysalbank</h1>
          <p style="font-size: 10px; color: #666; margin: 5px 0 0 0;">Banking with a difference</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 20px; margin: 0; font-weight: bold; font-family: Arial, sans-serif;">Account Statement</h2>
          <p style="font-size: 11px; margin: 5px 0 0 0; font-weight: bold;">Statement Date: ${accountInfo.statementDate}</p>
          <p style="font-size: 11px; margin: 2px 0 0 0; font-weight: bold;">Page 1 of 1</p>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <p style="font-size: 11px; margin: 0; font-weight: bold;">Statement Period From: ${accountInfo.statementPeriodFrom} <span style="margin-left: 20px;">To: ${accountInfo.statementPeriodTo}</span></p>
      </div>
    </div>
  `;
};

const generateAccountInfo = (accountInfo: FaisalAccountInfo) => {
  return `
    <div style="padding: 15px 30px; background-color: #f5f5f5; border-bottom: 1px solid #ddd;">
      <table style="width: 100%; font-size: 11px; font-family: Arial, sans-serif;" cellspacing="0" cellpadding="5">
        <tr>
          <td style="font-weight: bold; width: 15%;">Account No :</td>
          <td style="width: 35%;">${accountInfo.accountNo}</td>
          <td style="font-weight: bold; width: 15%;">Title Of Account :</td>
          <td style="width: 35%;">${accountInfo.accountTitle}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Address :</td>
          <td colspan="3">${accountInfo.address} ${accountInfo.phoneNo}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Deposit Type :</td>
          <td>${accountInfo.depositType}</td>
          <td style="font-weight: bold;">Currency :</td>
          <td>${accountInfo.currency}</td>
        </tr>
      </table>
    </div>
  `;
};

const generateTransactionTable = (transactions: FaisalTransactionRow[]) => {
  const openingBalance = transactions.find(t => t.isOpeningBalance);
  const regularTransactions = transactions.filter(t => !t.isOpeningBalance);

  let totalWithdrawal = 0;
  let totalDeposit = 0;
  let endingBalance = '0.00';

  regularTransactions.forEach(tx => {
    if (tx.withdrawal) {
      const amt = parseFloat(String(tx.withdrawal).replace(/,/g, ''));
      if (!isNaN(amt)) totalWithdrawal += amt;
    }
    if (tx.deposit) {
      const amt = parseFloat(String(tx.deposit).replace(/,/g, ''));
      if (!isNaN(amt)) totalDeposit += amt;
    }
    if (tx.balance) {
      endingBalance = tx.balance;
    }
  });

  const tableRows = regularTransactions.map(tx => `
    <tr>
      <td style="border: 1px solid #000; padding: 5px; text-align: center; font-size: 10px;">${tx.postingDate}</td>
      <td style="border: 1px solid #000; padding: 5px; text-align: center; font-size: 10px;">${tx.effectiveDate}</td>
      <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">${tx.narration}</td>
      <td style="border: 1px solid #000; padding: 5px; text-align: center; font-size: 10px;">${tx.referenceNo}</td>
      <td style="border: 1px solid #000; padding: 5px; text-align: right; font-size: 10px;">${tx.withdrawal || ''}</td>
      <td style="border: 1px solid #000; padding: 5px; text-align: right; font-size: 10px;">${tx.deposit || ''}</td>
      <td style="border: 1px solid #000; padding: 5px; text-align: right; font-size: 10px;">${tx.balance}</td>
    </tr>
  `).join('');

  return `
    <div style="padding: 20px 30px;">
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;" cellspacing="0">
        <thead>
          <tr style="background-color: #fff;">
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Posting<br/>Date</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Effective<br/>Date</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Narration</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Reference No</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Withdrawal</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Deposit</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; font-weight: bold;">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${openingBalance ? `
          <tr style="background-color: #f9f9f9;">
            <td colspan="6" style="border: 1px solid #000; padding: 5px; font-weight: bold; font-size: 11px;">Opening Balance as of ${openingBalance.postingDate}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">${openingBalance.balance}</td>
          </tr>
          ` : ''}
          ${tableRows}
          <tr style="background-color: #f9f9f9;">
            <td colspan="4" style="border: 1px solid #000; padding: 5px; font-weight: bold; font-size: 11px; text-align: right;">
              ${formatNumber(totalWithdrawal)}<br/>
              ${formatNumber(totalDeposit)}
            </td>
            <td colspan="3" style="border: 1px solid #000; padding: 5px; font-size: 11px;">
              <div><strong>No. of Transactions (${regularTransactions.length})</strong> <span style="float: right;"><strong>Ending Balance as of ${regularTransactions[regularTransactions.length - 1]?.postingDate || ''}</strong> ${endingBalance}</span></div>
              <div style="margin-top: 5px;"><span style="float: right;"><strong>Available Balance as of ${regularTransactions[regularTransactions.length - 1]?.postingDate || ''}</strong> ${endingBalance}</span></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

const generateFooter = () => {
  return `
    <div style="padding: 20px 30px; font-size: 9px; line-height: 1.4; color: #333; border-top: 1px solid #ddd; background-color: #f9f9f9;">
      <p style="margin: 5px 0;"><strong>***AS PER SBP MANDATE PLEASE SUBMIT AN ATTESTED COPY OF YOUR VALID CNIC, IF NOT PROVIDED EARLIER. NON-PROVISION CAN HAMPER THE SERVICES***</strong></p>
      <p style="margin: 5px 0;"><strong>** FOR BANK'S PROFILE PLEASE VISIT OUR WEBSITE "WWW.FAYSALBANK.COM" **</strong></p>
      <p style="margin: 5px 0;"><strong>"FOR COMPLAINTS WHICH REMAIN UNRESOLVED BEYOND 45 DAYS, YOU MAY WRITE TO BANKING MOHTASIB PAKISTAN, SHAHEEN COMPLEX, M.R KIYANI ROAD, KARACHI OR VISIT WWW.BANKINGMOHTASIB.GOV.PK"</strong></p>
    </div>
  `;
};

export const generateFaisalHTML = (
  transactions: FaisalTransactionRow[],
  accountInfo: FaisalAccountInfo
): string => {
  const header = generateHeader(accountInfo);
  const accountInfoSection = generateAccountInfo(accountInfo);
  const transactionTable = generateTransactionTable(transactions);
  const footer = generateFooter();

  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background-color: #fff; }
    table { border-collapse: collapse; }
    @media print { .page-break { page-break-after: always; } }
  `;

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Faisal Bank Statement</title>
        <style>${styles}</style>
      </head>
      <body>
        <div style="max-width: 1000px; margin: 0 auto; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          ${header}
          ${accountInfoSection}
          ${transactionTable}
          ${footer}
        </div>
      </body>
    </html>
  `;
};
